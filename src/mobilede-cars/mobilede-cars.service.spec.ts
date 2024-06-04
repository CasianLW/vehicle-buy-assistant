import { Test, TestingModule } from '@nestjs/testing';
import { MobiledeCarsService } from './mobilede-cars.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MobiledeCarsService', () => {
  let service: MobiledeCarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobiledeCarsService],
    }).compile();

    service = module.get<MobiledeCarsService>(MobiledeCarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchCars', () => {
    it('should throw an error if make is missing', async () => {
      await expect(service.fetchCars('', 'model', 'year')).rejects.toThrow(
        'Make, model, and year are required parameters.',
      );
    });

    it('should throw an error if model is missing', async () => {
      await expect(service.fetchCars('make', '', 'year')).rejects.toThrow(
        'Make, model, and year are required parameters.',
      );
    });

    it('should throw an error if year is missing', async () => {
      await expect(service.fetchCars('make', 'model', '')).rejects.toThrow(
        'Make, model, and year are required parameters.',
      );
    });

    it('should fetch cars data successfully', async () => {
      const html = `
        <div class="list-entry">
          <div class="vehicle-title">Test Car</div>
          <div class="seller-currency">€10,000</div>
          <div class="vehicle-information">
            <p>Detail 1</p>
            <p>Detail 2</p>
          </div>
          <div class="mde-icon-flag"></div>
          <img class="img-lazy" src="/test.jpg">
          <a class="vehicle-data" href="/test-link"></a>
        </div>
      `;

      mockedAxios.get.mockResolvedValue({ data: html });

      const result = await service.fetchCars('make', 'model', '2021', {});

      expect(result.cars).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Car',
            price: '€10,000',
            details: 'Detail 1, Detail 2',
            imgSrc: 'https://img.classistatic.de/test.jpg',
            href: 'https://www.automobile.fr/test-link',
          }),
        ]),
      );
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(
        service.fetchCars('make', 'model', '2021', {}),
      ).rejects.toThrow('Failed to fetch cars');
    });
  });
});

// Service Definition Test
// should be defined
// This test ensures that the MobiledeCarsService is defined and can be instantiated.

// Parameter Validation Tests
// should throw an error if make is missing
// should throw an error if model is missing
// should throw an error if year is missing
// These tests ensure that the service throws an error if any of the required parameters (make, model, year) are missing.

// Successful Fetch Test
// should fetch cars data successfully
// This test simulates a successful response from the axios.get call and checks if the service correctly parses and returns the car data.

// Error Handling Test
// should handle errors gracefully
// This test simulates an error from the axios.get call and ensures that the service throws an appropriate error.
