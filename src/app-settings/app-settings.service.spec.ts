import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppSettingsService } from './app-settings.service';
import { AppSettings } from '../schemas/app-settings.schema';
import { Model, Document } from 'mongoose';

const mockAppSettings = {
  aiSelected: 'mistral',
  modelForMistral: 'open-mistral-7b',
  modelForOpenAI: 'gpt-3.5-turbo',
  modelForClaude: 'claude-3-haiku-20240307',
};

type MockAppSettingsDocument = Document &
  AppSettings & {
    save: jest.Mock<Promise<any>>;
  };

describe('AppSettingsService', () => {
  let service: AppSettingsService;
  let model: Model<AppSettings>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppSettingsService,
        {
          provide: getModelToken(AppSettings.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppSettingsService>(AppSettingsService);
    model = module.get<Model<AppSettings>>(getModelToken(AppSettings.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeSettings', () => {
    it('should create default settings if none exist', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const saveMock = jest.fn().mockResolvedValue(mockAppSettings);
      jest
        .spyOn(model, 'create')
        .mockImplementation((settings: Partial<AppSettings>) => {
          return Promise.resolve({
            ...settings,
            save: saveMock,
          } as MockAppSettingsDocument);
        });

      await service.initializeSettings();

      expect(model.findOne).toHaveBeenCalled();
      expect(model.create).toHaveBeenCalledWith(mockAppSettings);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should not create settings if they already exist', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAppSettings),
      } as any);

      await service.initializeSettings();

      expect(model.findOne).toHaveBeenCalled();
      expect(model.create).not.toHaveBeenCalled();
    });
  });

  describe('getAppSettings', () => {
    it('should return app settings', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAppSettings),
      } as any);

      const result = await service.getAppSettings();

      expect(result).toEqual(mockAppSettings);
      expect(model.findOne).toHaveBeenCalled();
    });
  });

  describe('updateAppSettings', () => {
    it('should update existing settings', async () => {
      jest
        .spyOn(service, 'getAppSettings')
        .mockResolvedValueOnce(mockAppSettings as any);
      jest.spyOn(model, 'updateOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ n: 1, nModified: 1, ok: 1 }),
      } as any);
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({
          ...mockAppSettings,
          aiSelected: 'openai',
        }),
      } as any);

      const update = { aiSelected: 'openai' };
      const result = await service.updateAppSettings(update);

      expect(result.aiSelected).toEqual('openai');
      expect(model.updateOne).toHaveBeenCalledWith({}, update);
    });

    it('should create settings if none exist', async () => {
      jest.spyOn(service, 'getAppSettings').mockResolvedValueOnce(null);
      const saveMock = jest.fn().mockResolvedValue(mockAppSettings);
      jest
        .spyOn(model, 'create')
        .mockImplementation((settings: Partial<AppSettings>) => {
          return Promise.resolve({
            ...settings,
            save: saveMock,
          } as MockAppSettingsDocument);
        });

      const update = { aiSelected: 'openai' };
      const result = await service.updateAppSettings(update);

      expect(result).toEqual(mockAppSettings);
      expect(model.create).toHaveBeenCalledWith(update);
      expect(saveMock).toHaveBeenCalled();
    });
  });
});

// Tests:

// initializeSettings:
// Should create default settings if none exist.
// Should not create settings if they already exist.

// getAppSettings:
// Should return app settings.

// updateAppSettings:
// Should update existing settings.
// Should create settings if none exist.
