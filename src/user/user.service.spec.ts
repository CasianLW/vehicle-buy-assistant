import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUser = (username: string, email: string): Partial<User> => ({
  username,
  email,
  password: 'password123',
  isBanned: false,
  isPremium: false,
  roles: ['user'],
});

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // it('should create a user', async () => {
    //   const createUserDto = {
    //     username: 'testuserJEST',
    //     password: 'password123',
    //     email: 'testJEST@example.com',
    //     isBanned: false,
    //     isPremium: false,
    //     roles: ['user'],
    //   };

    //   // Mock no existing user
    //   jest.spyOn(model, 'findOne').mockReturnValueOnce({
    //     exec: jest.fn().mockResolvedValue(null),
    //   } as any);

    //   // Mock created user and save method
    //   const saveMock = jest.fn().mockResolvedValue(createUserDto);
    //   const createMock = jest.fn().mockImplementation(() => ({
    //     ...createUserDto,
    //     save: saveMock,
    //   }));

    //   jest.spyOn(model, 'create').mockImplementation(createMock as any);

    //   const result = await service.create(createUserDto);

    //   expect(model.findOne).toHaveBeenCalledWith({
    //     $or: [
    //       { username: createUserDto.username },
    //       { email: createUserDto.email },
    //     ],
    //   });
    //   expect(model.create).toHaveBeenCalledWith(createUserDto);
    //   expect(saveMock).toHaveBeenCalled();
    //   expect(result).toEqual(createUserDto);
    // });

    it('should throw a conflict exception if username or email already exists', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        isBanned: false,
        isPremium: false,
        roles: ['user'],
      };

      // Mock existing user
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(createUserDto),
      } as any);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        mockUser('user1', 'user1@example.com'),
        mockUser('user2', 'user2@example.com'),
      ];
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = mockUser('testuser', 'test@example.com');
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findById('someId');

      expect(result).toEqual(user);
    });

    it('should throw a not found exception if user is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findById('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const user = mockUser('testuser', 'test@example.com');
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.findByUsername('testuser');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      const updatedUser = {
        ...updateUserDto,
        isBanned: false,
        isPremium: false,
        roles: ['user'],
      };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await service.update('someId', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw a conflict exception if username or email already exists', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updateUserDto),
      } as any);

      await expect(service.update('someId', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a not found exception if user is not found', async () => {
      const updateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.update('someId', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const deletedUser = mockUser('testuser', 'test@example.com');
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(deletedUser),
      } as any);

      const result = await service.delete('someId');

      expect(result).toEqual({ message: 'User successfully deleted' });
    });

    it('should throw a not found exception if user is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.delete('someId')).rejects.toThrow(NotFoundException);
    });
  });
});

// Tests:

// -create Method:
// Success Case:
// It should create a new user if the username and email are unique.
// Mock userModel.findOne to return null indicating no user with the given username or email exists.
// Mock userModel.create to return the created user.
// Failure Case:
// It should throw a ConflictException if the username or email already exists.
// Mock userModel.findOne to return an existing user.

// -findAll Method:
// Success Case:
// It should return an array of all users.
// Mock userModel.find to return a list of users.

// -findById Method:
// Success Case:
// It should return a user by ID.
// Mock userModel.findById to return a user.
// Failure Case:
// It should throw a NotFoundException if the user is not found.
// Mock userModel.findById to return null.

// -findByUsername Method:
// Success Case:
// It should return a user by username.
// Mock userModel.findOne to return a user.
// Failure Case:
// It should throw a NotFoundException if the user is not found.
// Mock userModel.findOne to return null.

// -update Method:
// Success Case:
// It should update the user's details if the username and email are unique.
// Mock userModel.findOne to return null indicating no conflicting user.
// Mock userModel.findByIdAndUpdate to return the updated user.
// Failure Case:
// It should throw a ConflictException if the username or email already exists.
// Mock userModel.findOne to return an existing user with a different ID.
// It should throw a NotFoundException if the user is not found.
// Mock userModel.findByIdAndUpdate to return null.

// -delete Method:
// Success Case:
// It should delete a user by ID and return a success message.
// Mock userModel.findByIdAndDelete to return a user.
// Failure Case:
// It should throw a NotFoundException if the user is not found.
// Mock userModel.findByIdAnd
