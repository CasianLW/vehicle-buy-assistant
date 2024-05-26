import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { LeboncoinService } from './leboncoin.service';

@Controller('leboncoin')
export class LeboncoinController {
  constructor(private readonly leboncoinService: LeboncoinService) {}

  @Get('cars')
  async getCars() {
    try {
      const cars = await this.leboncoinService.scrapeCars();
      return cars;
    } catch (error) {
      console.error('Error in controller:', error);
      throw new HttpException('Failed to fetch data', HttpStatus.BAD_GATEWAY);
    }
  }
}
