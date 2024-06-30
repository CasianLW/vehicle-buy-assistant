import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserDocument } from '../schemas/user.schema';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
  });

  const user: UserDocument = {
    email: 'test@example.com',
    password: 'hashedpassword',
    username: 'testuser',
    roles: ['user'],
    isBanned: false,
    isPremium: false,
    _id: {
      toHexString: () => 'uniqueUserId',
    },
  } as UserDocument; // Cast to UserDocument to satisfy TypeScript

  describe('validateUser', () => {
    it('should return the user if the email and password match', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      expect(
        await service.validateUser('test@example.com', 'password'),
      ).toEqual(user);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if the email does not exist', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      expect(
        await service.validateUser('unknown@example.com', 'password'),
      ).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      expect(
        await service.validateUser('test@example.com', 'wrongpassword'),
      ).toBeNull();
    });
  });

  describe('register', () => {
    it('should hash the password and create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
        roles: ['User'],
        isBanned: false,
        isPremium: false,
      };
      const newUser = {
        ...createUserDto,
        _id: { toHexString: () => 'userid' },
        password: 'hashedpassword',
      } as UserDocument;
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      jest.spyOn(userService, 'create').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt.token.here');

      const result = await service.register(createUserDto);
      expect(result).toEqual({ access_token: 'jwt.token.here' });
    });
  });

  describe('forgotPassword', () => {
    it('should send a reset code if the email is found', async () => {
      const user = { email: 'test@example.com' } as UserDocument;
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(emailService, 'sendMail').mockResolvedValue();

      await service.forgotPassword('test@example.com');
      expect(emailService.sendMail).toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException if no user is found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      await expect(service.forgotPassword('test@example.com')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('resetPassword', () => {
    it('should update the user password if the reset code and email are valid', async () => {
      // Simulate a password forgot request which populates the resetTokens
      const resetCode = '123456';
      const expiration = Date.now() + 10000; // Set expiration 10 seconds in the future
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(emailService, 'sendMail').mockResolvedValue();

      await service.forgotPassword(user.email); // This should set the token
      // Manually adjust the reset token map for test
      service['resetTokens'].set(user.email, {
        code: resetCode,
        expires: expiration,
      });

      // Now test resetPassword with the valid reset code
      const newPassword = 'newSecurePassword123';
      await expect(
        service.resetPassword(user.email, resetCode, newPassword, newPassword),
      ).resolves.not.toThrow();

      expect(userService.updatePassword).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
      );
    });
  });
});

// Tests:

// AuthService
//   validateUser
//      should return the user if the email and password match (6 ms)
//      should return null if the email does not exist
//      should return null if the password is incorrect
//   register
//      should hash the password and create a new user
//   forgotPassword
//      should send a reset code if the email is found
//      should throw an UnauthorizedException if no user is found
//   resetPassword
//      should update the user password if the reset code and email are valid (1 ms)
