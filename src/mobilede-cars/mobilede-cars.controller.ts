import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { MobiledeCarsService } from './mobilede-cars.service';
import { Public } from 'src/auth/public.decorator';

@Controller('mobilede-cars')
export class MobiledeCarsController {
  constructor(private readonly mobiledeCarsService: MobiledeCarsService) {}

  @Get()
  @Public()
  async getCars(
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('year') year: string,
    @Query() filters: any,
  ) {
    if (!make || !model || !year) {
      throw new BadRequestException(
        'Make, model, and year are required parameters.',
      );
    }

    return this.mobiledeCarsService.fetchCars(make, model, year, filters);
  }
}
