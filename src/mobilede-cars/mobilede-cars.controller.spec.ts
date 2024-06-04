import { Test, TestingModule } from '@nestjs/testing';
import { MobiledeCarsController } from './mobilede-cars.controller';
import { MobiledeCarsService } from './mobilede-cars.service';
import { BadRequestException } from '@nestjs/common';

describe('MobiledeCarsController', () => {
  let controller: MobiledeCarsController;
  let service: MobiledeCarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobiledeCarsController],
      providers: [
        {
          provide: MobiledeCarsService,
          useValue: {
            fetchCars: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MobiledeCarsController>(MobiledeCarsController);
    service = module.get<MobiledeCarsService>(MobiledeCarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCars', () => {
    it('should throw an error if make is missing', async () => {
      await expect(controller.getCars('', 'model', 'year', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if model is missing', async () => {
      await expect(controller.getCars('make', '', 'year', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if year is missing', async () => {
      await expect(controller.getCars('make', 'model', '', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return cars data if parameters are valid', async () => {
      const result = { seeAllUrl: 'test-url', cars: [] };
      jest.spyOn(service, 'fetchCars').mockResolvedValue(result);

      const response = await controller.getCars('make', 'model', '2021', {});

      expect(response).toBe(result);
      expect(service.fetchCars).toHaveBeenCalledWith(
        'make',
        'model',
        '2021',
        {},
      );
    });
  });
});

// Controller Definition Test

// should be defined
// This test ensures that the MobiledeCarsController is defined and can be instantiated.

// Parameter Validation Tests
// should throw an error if make is missing
// should throw an error if model is missing
// should throw an error if year is missing
// These tests ensure that the controller throws a BadRequestException if any of the required parameters (make, model, year) are missing.

// Successful Fetch Test
// should return cars data if parameters are valid
// This test mocks the service's fetchCars method to simulate a successful response and checks if the controller correctly returns the data.
