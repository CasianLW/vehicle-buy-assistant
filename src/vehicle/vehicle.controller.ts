import { Controller, Post, Body } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('process')
  async processPrompt(
    @Body() body: { userId?: string; service: string; prompt: string },
  ) {
    return this.vehicleService.processPrompt(
      body.userId,
      body.service,
      body.prompt,
    );
  }
}
