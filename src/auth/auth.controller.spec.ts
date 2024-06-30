import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  // let authService: AuthService;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  describe('register', () => {
    it('should register a user and return access token', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      const accessToken = 'access_token_here';
      authService.register.mockResolvedValue({ access_token: accessToken });

      const result = await controller.register(createUserDto);
      expect(result).toEqual({ access_token: accessToken });
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
      authService.register.mockRejectedValue(
        new ConflictException('Username already exists'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token for a valid user', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password',
      };
      const accessToken = 'jwt.token.here';
      authService.validateUser.mockResolvedValue({} as any); // Simulate user validation
      authService.login.mockResolvedValue({ access_token: accessToken });

      const result = await controller.login(loginDto);
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw an unauthorized exception if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrong',
      };
      authService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should throw an unauthorized exception if email not found', async () => {
      const forgotPasswordDto = { email: 'unknown@example.com' };
      authService.forgotPassword.mockRejectedValue(
        new UnauthorizedException('Email not found'),
      );

      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('should throw a bad request exception if reset code is invalid', async () => {
      const resetPasswordDto = {
        email: 'test@example.com',
        code: 'wrongcode',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123',
      };
      authService.resetPassword.mockRejectedValue(
        new BadRequestException('Invalid reset code or passwords do not match'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// Tests:

// register:
// Should register a user with valid data.
// Should throw an error if the username already exists.
// Should return appropriate error codes for invalid data.

// login:
// Should login a user with valid credentials and return a JWT token.
// Should throw an error if the credentials are invalid.

// Error Handling:
// Validation of request body fields for the register endpoint.
// Handling of missing or invalid credentials for the login endpoint.
// Appropriate error codes for different error scenarios.

// forgotPassword:
// Should throw an error if the email is not found.

// resetPassword:
// Should throw an error if the reset code is invalid.
