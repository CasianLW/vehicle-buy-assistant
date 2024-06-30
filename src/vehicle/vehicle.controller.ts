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
import { Public } from '../auth/public.decorator';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Public()
  @Post('process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process a vehicle prompt',
    description:
      'Processes a prompt related to vehicles and returns the processed data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prompt processed successfully',
    type: 'object',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'User ID, logged-in status, and prompt to process',
    type: 'object',
    examples: {
      example1: {
        summary: 'Example Prompt',
        value: {
          userId: '123',
          userLogged: false,
          prompt: `Marie 40 ans mère de 2 enfants, veut acheter une nouvelle voiture qu'elle compte utiliser en daily pour aller ses enfants à l'école, faire les courses etc.`,
        },
      },
    },
  })
  async processPrompt(
    @Body() body: { userId?: string; userLogged: boolean; prompt: string },
  ) {
    try {
      const response = await this.vehicleService.processPrompt(
        body.userId,
        body.userLogged,
        body.prompt +
          ` ` +
          'Quelle voitures recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 3 et 6).',
        false,
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

  @Public()
  @Post('rapport')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate a vehicle report',
    description:
      'Generates a detailed report for a vehicle based on user input and AI processing.',
  })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    type: 'object',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'User ID, vehicle data, and logged-in status',
    type: 'object',
    required: true,
    examples: {
      example1: {
        summary: 'Example Report Request',
        value: {
          userId: '123',
          userLogged: true,
          vehicleData: {
            make: 'Toyota',
            makeId: 1,
            model: 'Corolla',
            modelId: 2,
            year: 2022,
            price: 20000,
            consumption: 6,
            fuel_cost: 1500,
            annual_maintenance: 500,
            registration_cost: 200,
            estimated_insurance: 600,
            max_km: 100000,
            description: 'Reliable family car with excellent mileage.',
          },
        },
      },
    },
  })
  async generateReport(
    @Body() body: { userId: string; userLogged: boolean; vehicleData: any },
  ) {
    try {
      if (!body.userLogged || !body.userId) {
        throw new BadRequestException(
          'User must be logged in with a valid ID.',
        );
      }

      const prompt = `Generate a detailed report for the following vehicle: ${JSON.stringify(body.vehicleData)}`;
      const response = await this.vehicleService.processPrompt(
        body.userId,
        body.userLogged,
        prompt,
        true,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Report generated successfully',
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
