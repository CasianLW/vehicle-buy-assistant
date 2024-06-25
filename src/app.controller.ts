import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Welcome Message',
    description: 'Returns a welcome message from the API.',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message returned successfully.',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
