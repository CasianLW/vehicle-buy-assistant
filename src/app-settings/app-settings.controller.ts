import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingsDto } from './dto/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppSettings } from 'src/schemas/app-settings.schema';

@ApiTags('app-settings')
@Controller('app-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get application settings',
    description:
      'Retrieves the current application settings. Access restricted to admin roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'App settings retrieved successfully',
    type: AppSettings,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAppSettings() {
    try {
      const settings = await this.appSettingsService.getAppSettings();
      return {
        statusCode: HttpStatus.OK,
        message: 'App settings retrieved successfully',
        data: settings,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Create application settings',
    description:
      'Creates new application settings. Intended to be used when initializing settings for the first time.',
  })
  @ApiResponse({
    status: 201,
    description: 'App settings created successfully',
    type: CreateAppSettingsDto,
  })
  @ApiResponse({ status: 409, description: 'Conflict, settings already exist' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: CreateAppSettingsDto,
    description: 'Payload to create new app settings',
  })
  async createAppSettings(@Body() createAppSettingsDto: CreateAppSettingsDto) {
    try {
      const settings =
        await this.appSettingsService.updateAppSettings(createAppSettingsDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'App settings created successfully',
        data: settings,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch()
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Update application settings',
    description:
      'Updates existing application settings. This can include changing the AI selection, models, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'App settings updated successfully',
    type: UpdateAppSettingsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found, no existing settings to update',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: UpdateAppSettingsDto,
    description: 'Payload to update existing app settings',
  })
  async updateAppSettings(@Body() updateAppSettingsDto: UpdateAppSettingsDto) {
    try {
      const settings =
        await this.appSettingsService.updateAppSettings(updateAppSettingsDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'App settings updated successfully',
        data: settings,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
