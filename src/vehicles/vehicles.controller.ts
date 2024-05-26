import { Controller, Get } from '@nestjs/common';
import { LeboncoinService } from '../leboncoin/leboncoin.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly leboncoinService: LeboncoinService) {}

  @Get('search')
  async searchVehicles() {
    return await this.leboncoinService.searchVehicles();
  }
}
