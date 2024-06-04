import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if the username and password match', async () => {
      const user = {
        username: 'testuser',
        password: 'hashedpassword',
        email: 'test@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      const compare = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);

      expect(await service.validateUser('testuser', 'password')).toEqual(user);
      expect(compare).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if the username does not exist', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      expect(await service.validateUser('unknown', 'password')).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      const user = {
        username: 'testuser',
        password: 'hashedpassword',
        email: 'test@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);

      expect(
        await service.validateUser('testuser', 'wrongpassword'),
      ).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a valid JWT token for a given user', async () => {
      const user = { username: 'testuser', _id: 'userid', roles: ['user'] };
      const token = 'jwt.token.here';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      expect(await service.login(user)).toEqual({ access_token: token });
    });
  });

  describe('register', () => {
    it('should hash the password and create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      const hashedPassword = 'hashedpassword';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(userService, 'create')
        .mockResolvedValue({ ...createUserDto, password: hashedPassword });

      expect(await service.register(createUserDto)).toEqual({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('should throw a conflict exception if the username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password',
        email: 'existing@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      jest
        .spyOn(userService, 'findByUsername')
        .mockResolvedValue(createUserDto);

      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});

// Tests:

// validateUser:
// Should return the user if the username and password match.
// Should return null if the username does not exist.
// Should return null if the password is incorrect.

// login:
// Should return a valid JWT token for a given user.

// register:
// Should hash the password and create a new user.
// Should throw a conflict exception if the username already exists.

// Error Handling:
// Validation of username and password.
// Handling of existing usernames during registration.
// Appropriate error codes for different error scenarios.
