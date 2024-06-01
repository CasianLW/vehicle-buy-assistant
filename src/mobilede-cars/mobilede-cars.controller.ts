import { Controller, Get, Query } from '@nestjs/common';
import { MobiledeCarsService } from './mobilede-cars.service';

@Controller('mobilede-cars')
export class MobiledeCarsController {
  constructor(private readonly mobiledeCarsService: MobiledeCarsService) {}

  @Get()
  async getCars(
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('year') year: string,
    @Query() filters: any,
  ) {
    return this.mobiledeCarsService.fetchCars(make, model, year, filters);
  }
}
