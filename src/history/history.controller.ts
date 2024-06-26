import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { History } from 'src/schemas/history.schema';
@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create history',
    description: 'Creates a new history record for a user interaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'History record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Missing required fields.' })
  @ApiBody({
    description: 'Data needed to create a history record',
    type: 'object',
    examples: {
      example1: {
        summary: 'Example history entry',
        value: {
          userId: '123456',
          userLogged: true,
          prompt: `Marie 40 ans mère de 2 enfants, veut acheter une nouvelle voiture qu'elle compte utiliser en daily pour aller ses enfants à l'école, faire les courses etc. Quelle voiture recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 4 et 10).`,
          response: `
    [
        {
            "make": "Toyota",
            "makeId": 999999,
            "model": "Corolla",
            "modelId": 999999,
            "year": 2020,
            "price": 22000,
            "consumption": 6,
            "fuel_cost": 1.6,
            "annual_maintenance": 400,
            "registration_cost": 200,
            "estimated_insurance": 800,
            "max_km": 300000,
            "description": "Reliable family car with good fuel efficiency and low maintenance costs."
        },
        
        {
            "make": "Ford",
            "makeId": 999999,
            "model": "Focus",
            "modelId": 999999,
            "year": 2018,
            "price": 18000,
            "consumption": 6.5,
            "fuel_cost": 1.7,
            "annual_maintenance": 500,
            "registration_cost": 200,
            "estimated_insurance": 700,
            "max_km": 200000,
            "description": "Compact and affordable family car with reasonable fuel efficiency."
        },
    ]`,
        },
      },
    },
  })
  async create(
    @Body()
    body: {
      userId: string;
      userLogged: boolean;
      prompt: string;
      response: string;
    },
  ) {
    if (!body.userId || !body.userLogged || !body.prompt || !body.response) {
      throw new BadRequestException('Missing required fields.');
    }
    return this.historyService.createHistory(
      body.userId,
      body.userLogged,
      body.prompt,
      body.response,
    );
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user history',
    description: 'Retrieves the interaction history for a specific user.',
  })
  @ApiResponse({
    status: 200,
    description: 'History retrieved successfully.',
    type: [History],
  })
  @ApiResponse({
    status: 404,
    description: 'No history found for the provided user ID.',
  })
  @ApiResponse({ status: 400, description: 'User ID is required.' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'The user ID to retrieve history for',
    required: true,
  })
  async getHistory(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
    return this.historyService.getHistoryByUserId(userId);
  }
}
