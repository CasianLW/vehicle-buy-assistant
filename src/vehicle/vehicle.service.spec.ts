import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HistoryService } from '../history/history.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { of } from 'rxjs';

const mockAppSettings = {
  aiSelected: 'mistral',
  modelForMistral: 'open-mistral-7b',
  modelForOpenAI: 'gpt-3.5-turbo',
  modelForClaude: 'claude-3-haiku-20240307',
};

jest.mock('openai');
jest.mock('@anthropic-ai/sdk');

describe('VehicleService', () => {
  let service: VehicleService;
  let httpService: HttpService;
  let configService: ConfigService;
  let historyService: HistoryService;
  let appSettingsService: AppSettingsService;
  let openai: jest.Mocked<OpenAI>;
  let anthropic: jest.Mocked<Anthropic>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of({ data: {} })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            createHistory: jest.fn(),
          },
        },
        {
          provide: AppSettingsService,
          useValue: {
            getAppSettings: jest.fn().mockResolvedValue(mockAppSettings),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    historyService = module.get<HistoryService>(HistoryService);
    appSettingsService = module.get<AppSettingsService>(AppSettingsService);

    openai = new OpenAI({ apiKey: 'test' }) as jest.Mocked<OpenAI>;
    anthropic = new Anthropic({ apiKey: 'test' }) as jest.Mocked<Anthropic>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
    expect(appSettingsService).toBeDefined();
    expect(configService).toBeDefined();
    expect(openai).toBeDefined();
    expect(anthropic).toBeDefined();
  });

  describe('fetchAIResponse', () => {
    it('should call fetchOpenAIResponse when aiSelected is openai', async () => {
      jest.spyOn(service, 'fetchOpenAIResponse').mockResolvedValue('response');
      mockAppSettings.aiSelected = 'openai';

      const result = await service.fetchAIResponse('prompt', true);

      expect(result).toBe('response');
      expect(service.fetchOpenAIResponse).toHaveBeenCalledWith('prompt', true);
    });

    it('should call fetchMistralAIResponse when aiSelected is mistral', async () => {
      jest
        .spyOn(service, 'fetchMistralAIResponse')
        .mockResolvedValue('response');
      mockAppSettings.aiSelected = 'mistral';

      const result = await service.fetchAIResponse('prompt', true);

      expect(result).toBe('response');
      expect(service.fetchMistralAIResponse).toHaveBeenCalledWith(
        'prompt',
        true,
      );
    });

    it('should call fetchClaudeAIResponse when aiSelected is claude', async () => {
      jest
        .spyOn(service, 'fetchClaudeAIResponse')
        .mockResolvedValue('response');
      mockAppSettings.aiSelected = 'claude';

      const result = await service.fetchAIResponse('prompt', true);

      expect(result).toBe('response');
      expect(service.fetchClaudeAIResponse).toHaveBeenCalledWith(
        'prompt',
        true,
      );
    });

    it('should throw an error for unsupported AI service', async () => {
      mockAppSettings.aiSelected = 'unsupported';

      await expect(service.fetchAIResponse('prompt', true)).rejects.toThrow(
        'Unsupported AI service',
      );
    });
  });
  describe('processPrompt', () => {
    it('should call fetchAIResponse and createHistory', async () => {
      jest.spyOn(service, 'fetchAIResponse').mockResolvedValue('response');
      jest.spyOn(historyService, 'createHistory').mockResolvedValue(null);

      const result = await service.processPrompt('userId', true, 'prompt');

      expect(result).toBe('response');
      expect(service.fetchAIResponse).toHaveBeenCalledWith('prompt', true);
      expect(historyService.createHistory).toHaveBeenCalledWith(
        'userId',
        true,
        'prompt',
        'response',
      );
    });

    it('should throw an error if fetchAIResponse fails', async () => {
      jest
        .spyOn(service, 'fetchAIResponse')
        .mockRejectedValue(new Error('Error processing prompt'));

      await expect(
        service.processPrompt('userId', true, 'prompt'),
      ).rejects.toThrow('Error processing prompt');
    });
  });
});

// Tests:

// fetchAIResponse:
// Should call fetchOpenAIResponse when aiSelected is openai.
// Should call fetchMistralAIResponse when aiSelected is mistral.
// Should call fetchClaudeAIResponse when aiSelected is claude.
// Should throw an error for unsupported AI service.

// processPrompt:
// Should call fetchAIResponse and createHistory.
// Should throw an error if fetchAIResponse fails.
