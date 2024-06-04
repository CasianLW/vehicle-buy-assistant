import { Test, TestingModule } from '@nestjs/testing';
import { AppSettingsController } from './app-settings.controller';
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingsDto } from './dto/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { getModelToken } from '@nestjs/mongoose';
import { AppSettings } from '../schemas/app-settings.schema';
import {
  ConflictException,
  NotFoundException,
  // BadRequestException,
} from '@nestjs/common';

const mockAppSettings = {
  aiSelected: 'mistral',
  modelForMistral: 'open-mistral-7b',
  modelForOpenAI: 'gpt-3.5-turbo',
  modelForClaude: 'claude-3-haiku-20240307',
};

const mockAppSettingsService = {
  initializeSettings: jest.fn(),
  getAppSettings: jest.fn(),
  updateAppSettings: jest.fn(),
};

describe('AppSettingsController', () => {
  let controller: AppSettingsController;
  let service: AppSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppSettingsController],
      providers: [
        {
          provide: AppSettingsService,
          useValue: mockAppSettingsService,
        },
        {
          provide: getModelToken(AppSettings.name),
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AppSettingsController>(AppSettingsController);
    service = module.get<AppSettingsService>(AppSettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAppSettings', () => {
    it('should return app settings', async () => {
      mockAppSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      const result = await controller.getAppSettings();

      expect(result).toEqual({
        statusCode: 200,
        message: 'App settings retrieved successfully',
        data: mockAppSettings,
      });
    });
  });

  describe('createAppSettings', () => {
    it('should create app settings', async () => {
      mockAppSettingsService.updateAppSettings.mockResolvedValue(
        mockAppSettings,
      );

      const createAppSettingsDto: CreateAppSettingsDto = {
        aiSelected: 'openai',
        modelForMistral: 'open-mistral-7b',
        modelForOpenAI: 'gpt-3.5-turbo',
        modelForClaude: 'claude-3-haiku-20240307',
      };

      const result = await controller.createAppSettings(createAppSettingsDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'App settings created successfully',
        data: mockAppSettings,
      });
    });

    it('should handle conflict exception', async () => {
      mockAppSettingsService.updateAppSettings.mockRejectedValue(
        new ConflictException('Conflict'),
      );

      const createAppSettingsDto: CreateAppSettingsDto = {
        aiSelected: 'openai',
        modelForMistral: 'open-mistral-7b',
        modelForOpenAI: 'gpt-3.5-turbo',
        modelForClaude: 'claude-3-haiku-20240307',
      };

      await expect(
        controller.createAppSettings(createAppSettingsDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateAppSettings', () => {
    it('should update app settings', async () => {
      mockAppSettingsService.updateAppSettings.mockResolvedValue(
        mockAppSettings,
      );

      const updateAppSettingsDto: UpdateAppSettingsDto = {
        aiSelected: 'openai',
      };

      const result = await controller.updateAppSettings(updateAppSettingsDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'App settings updated successfully',
        data: mockAppSettings,
      });
    });

    it('should handle not found exception', async () => {
      mockAppSettingsService.updateAppSettings.mockRejectedValue(
        new NotFoundException('Not Found'),
      );

      const updateAppSettingsDto: UpdateAppSettingsDto = {
        aiSelected: 'openai',
      };

      await expect(
        controller.updateAppSettings(updateAppSettingsDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

// Tests:

// getAppSettings:
// Should return app settings.

// createAppSettings:
// Should create app settings.

// updateAppSettings:
// Should update app settings.
