import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processPrompt(
    @Body() body: { userId?: string; userLogged: boolean; prompt: string },
  ) {
    try {
      const response = await this.vehicleService.processPrompt(
        body.userId,
        body.userLogged,
        body.prompt,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Prompt processed successfully',
        data: response,
      };
    } catch (error) {
      if (error.message.includes('Error processing prompt')) {
        throw new InternalServerErrorException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
