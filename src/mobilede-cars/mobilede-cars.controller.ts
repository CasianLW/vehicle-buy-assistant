import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { MobiledeCarsService } from './mobilede-cars.service';
import { Public } from 'src/auth/public.decorator';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('mobilede-cars')
export class MobiledeCarsController {
  constructor(private readonly mobiledeCarsService: MobiledeCarsService) {}

  @ApiTags('mobilede-cars')
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get cars',
    description:
      'Retrieves cars based on make, model, and year with optional filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Car listings retrieved successfully',
    type: 'object',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, missing required query parameters',
  })
  @ApiQuery({
    name: 'make',
    type: String,
    required: true,
    description: 'Make of the car',
    example: 'Toyota',
  })
  @ApiQuery({
    name: 'model',
    type: String,
    required: true,
    description: 'Model of the car',
    example: 'Corolla',
  })
  @ApiQuery({
    name: 'year',
    type: String,
    required: true,
    description: 'Year of the car',
    example: '2020',
  })
  @ApiQuery({
    name: 'filters',
    type: 'object',
    required: false,
    description: 'Additional filters for car listings',
    example: { srt: 'price', sro: 'asc', dmg: 'false' },
  })
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
