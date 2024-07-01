import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

// const mockResponse = {
//   statusCode: HttpStatus.OK,
//   message: 'Prompt processed successfully',
//   data: 'response',
// };

describe('VehicleController', () => {
  let controller: VehicleController;
  // let service: VehicleService;
  let service: jest.Mocked<VehicleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            processPrompt: jest.fn(),
            // processPrompt: jest.fn().mockResolvedValue('response'),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    // service = module.get<VehicleService>(VehicleService);
    service = module.get(VehicleService);
    service.processPrompt = jest.fn();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processPrompt', () => {
    it('should return a success response', async () => {
      const body = { userId: 'userId', userLogged: true, prompt: 'prompt' };
      // Correctly setting up the mock to return the exact expected response
      service.processPrompt.mockResolvedValue('response');

      const expectedResponse = {
        statusCode: HttpStatus.OK,
        message: 'Prompt processed successfully',
        data: 'response',
      };

      const result = await controller.processPrompt(body);

      expect(result).toEqual(expectedResponse);
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

  describe('generateReport', () => {
    it('should generate a vehicle report successfully', async () => {
      const body = {
        userId: '123',
        userLogged: true,
        vehicleData: {
          make: 'Toyota',
          model: 'Corolla',
          year: 2022,
          price: 20000,
        },
      };
      const prompt = `Generate a detailed report for the following vehicle: ${JSON.stringify(body.vehicleData)}`;
      const expectedResponse = {
        statusCode: HttpStatus.OK,
        message: 'Report generated successfully',
        data: 'Detailed report data here',
      };

      service.processPrompt.mockResolvedValue('Detailed report data here');

      const result = await controller.generateReport(body);
      expect(result).toEqual(expectedResponse);
      expect(service.processPrompt).toHaveBeenCalledWith(
        body.userId,
        body.userLogged,
        prompt,
        true,
      );
    });

    it('should throw BadRequestException if user is not logged in', async () => {
      const body = {
        userId: '123',
        userLogged: false,
        vehicleData: {
          make: 'Toyota',
          model: 'Corolla',
          year: 2022,
          price: 20000,
        },
      };
      // const prompt = `Generate a detailed report for the following vehicle: ${JSON.stringify(body.vehicleData)}`;

      await expect(controller.generateReport(body)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.processPrompt).not.toHaveBeenCalled();
    });

    it('should handle errors from the service', async () => {
      const body = {
        userId: '123',
        userLogged: true,
        vehicleData: {
          make: 'Toyota',
          model: 'Corolla',
          year: 2022,
          price: 20000,
        },
      };
      const prompt = `Generate a detailed report for the following vehicle: ${JSON.stringify(body.vehicleData)}`;

      service.processPrompt.mockRejectedValue(
        new Error('Error processing prompt'),
      );

      await expect(controller.generateReport(body)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(service.processPrompt).toHaveBeenCalledWith(
        body.userId,
        body.userLogged,
        prompt,
        true,
      );
    });
  });
});

// Tests:

// processPrompt:
// Should return a success response.
// Should throw a BadRequestException on failure.

// generateReport:
// Should generate a vehicle report successfully.
// Should throw BadRequestException if user is not logged in.
// Should handle errors from the service.
