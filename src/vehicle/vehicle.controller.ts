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
import { Public } from 'src/auth/public.decorator';
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
          prompt: `Marie 40 ans mère de 2 enfants, veut acheter une nouvelle voiture qu'elle compte utiliser en daily pour aller ses enfants à l'école, faire les courses etc. Quelle voiture recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 4 et 10).`,
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
