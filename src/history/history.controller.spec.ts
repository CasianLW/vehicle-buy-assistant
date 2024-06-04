import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { BadRequestException } from '@nestjs/common';

const mockHistory = {
  userId: 'testUser',
  prompt: 'testPrompt',
  response: 'testResponse',
};

describe('HistoryController', () => {
  let controller: HistoryController;
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: {
            createHistory: jest.fn().mockResolvedValue(mockHistory),
            getHistoryByUserId: jest.fn().mockResolvedValue([mockHistory]),
          },
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a history record', async () => {
      const body = {
        userId: 'testUser',
        userLogged: true,
        prompt: 'testPrompt',
        response: 'testResponse',
      };
      const result = await controller.create(body);
      expect(result).toEqual(mockHistory);
      expect(service.createHistory).toHaveBeenCalledWith(
        body.userId,
        body.userLogged,
        body.prompt,
        body.response,
      );
    });

    it('should throw an error if required fields are missing', async () => {
      const body = {
        userId: '',
        userLogged: true,
        prompt: 'testPrompt',
        response: 'testResponse',
      };
      await expect(controller.create(body)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getHistory', () => {
    it('should return user history', async () => {
      const userId = 'testUser';
      const result = await controller.getHistory(userId);
      expect(result).toEqual([mockHistory]);
      expect(service.getHistoryByUserId).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if userId is missing', async () => {
      await expect(controller.getHistory('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

// Tests:

// create:
// Should create a history record with valid data.
// Should throw an error if any required fields are missing.
// Should return appropriate error codes for invalid data.

// getHistory:
// Should return history for a valid user ID.
// Should return an empty array if no history is found for the user ID.
// Should throw an error if the user ID is missing or invalid.

// Error Handling:
// Validation of request body fields for the create endpoint.
// Handling of missing or invalid user IDs for the getHistory endpoint.
// Appropriate error codes for different error scenarios.
