import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import {
  // BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
// import { Role } from '../auth/role.enum';
// import { Roles } from '../auth/roles.decorator';

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  isBanned: false,
  isPremium: false,
  roles: ['user'],
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findById: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            delete: jest
              .fn()
              .mockResolvedValue({ message: 'User successfully deleted' }),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isBanned: false,
        isPremium: false,
        roles: ['user'],
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'User successfully created',
        data: mockUser,
      });
    });

    it('should handle conflict exception', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isBanned: false,
        isPremium: false,
        roles: ['user'],
      };
      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'User found',
        data: mockUser,
      });
    });

    it('should handle not found exception', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'User successfully updated',
        data: mockUser,
      });
    });

    it('should handle conflict exception', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new ConflictException());
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle not found exception', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({
        statusCode: 200,
        message: 'User successfully deleted',
      });
    });

    it('should handle not found exception', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

// Tests:

// create:
// Should create a user with valid data.
// Should handle ConflictException when username or email already exists.

// findOne:
// Should return a user by ID.
// Should handle NotFoundException when user is not found.

// update:
// Should update a user with valid data.
// Should handle ConflictException when username or email already exists.
// Should handle NotFoundException when user is not found.

// remove:
// Should delete a user by ID.
// Should handle NotFoundException when user is not found.
