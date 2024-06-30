import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { HttpStatus } from '@nestjs/common';

const mockResponse = {
  statusCode: HttpStatus.OK,
  message: 'Prompt processed successfully',
  data: 'response',
};

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            processPrompt: jest.fn().mockResolvedValue('response'),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processPrompt', () => {
    it('should return a success response', async () => {
      const body = { userId: 'userId', userLogged: true, prompt: 'prompt' };
      const result = await controller.processPrompt(body);

      expect(result).toEqual(mockResponse);
      expect(service.processPrompt).toHaveBeenCalledWith(
        'userId',
        true,
        'prompt Quelle voitures recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 3 et 6).',
        false,
      );
    });

    it('should throw a BadRequestException on failure', async () => {
      jest
        .spyOn(service, 'processPrompt')
        .mockRejectedValue(new Error('Error processing prompt'));
      const body = { userId: 'userId', userLogged: true, prompt: 'prompt' };

      await expect(controller.processPrompt(body)).rejects.toThrow();
    });
  });
});

// Tests:

// processPrompt:
// Should return a success response.
// Should throw a BadRequestException on failure.
