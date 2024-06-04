import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return the user data', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'test@example.com',
        roles: ['user'],
        isBanned: false,
        isPremium: false,
      };
      const result = { ...createUserDto, password: 'hashedpassword' };
      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register(createUserDto)).toEqual(result);
    });
  });

  describe('login', () => {
    it('should return a JWT token for a valid user', async () => {
      const user = { username: 'testuser', _id: 'userid', roles: ['user'] };
      const token = 'jwt.token.here';
      jest.spyOn(service, 'login').mockResolvedValue({ access_token: token });

      expect(await controller.login({ user })).toEqual({ access_token: token });
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
