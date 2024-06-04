import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HistoryService } from './history.service';
import { History } from '../schemas/history.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

const mockHistory = {
  userId: 'testUser',
  prompt: 'testPrompt',
  response: 'testResponse',
};

type MockHistoryDocument = Partial<History> & { save: jest.Mock<any, any> };

describe('HistoryService', () => {
  let service: HistoryService;
  let model: Model<History>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getModelToken(History.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    model = module.get<Model<History>>(getModelToken(History.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHistory', () => {
    it('should create a history record', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockHistory);
      const createMock = jest.fn().mockReturnValue({
        ...mockHistory,
        save: saveMock,
      } as MockHistoryDocument);

      jest.spyOn(model, 'create').mockImplementation(createMock as any);

      const result = await service.createHistory(
        'testUser',
        true,
        'testPrompt',
        'testResponse',
      );

      expect(createMock).toHaveBeenCalledWith({
        userId: 'testUser',
        prompt: 'testPrompt',
        response: 'testResponse',
      });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockHistory);
    });

    it('should throw an error if required fields are missing', async () => {
      await expect(
        service.createHistory('', true, 'testPrompt', 'testResponse'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createHistory('testUser', true, '', 'testResponse'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createHistory('testUser', true, 'testPrompt', ''),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if user is not logged in', async () => {
      await expect(
        service.createHistory('testUser', false, 'testPrompt', 'testResponse'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getHistoryByUserId', () => {
    it('should return user history', async () => {
      const findMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockHistory]),
      });

      model.find = findMock as any;

      const result = await service.getHistoryByUserId('testUser');

      expect(findMock).toHaveBeenCalledWith({ userId: 'testUser' });
      expect(result).toEqual([mockHistory]);
    });

    it('should throw an error if userId is missing', async () => {
      await expect(service.getHistoryByUserId('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if no history is found', async () => {
      const findMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      model.find = findMock as any;

      await expect(service.getHistoryByUserId('testUser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

// Tests:

// createHistory:
// Should create a history record for a logged-in user.
// Should not create a history record if the user is not logged in.
// Should throw an error if any required fields are missing.

// getHistoryByUserId:
// Should return history for a valid user ID.
// Should return an empty array if no history is found for the user ID.
// Should handle errors when querying the database.

// Error Handling:
// Validation of required fields (userId, prompt, response).
// Handling of invalid or missing user IDs.
// Handling of database query errors.
