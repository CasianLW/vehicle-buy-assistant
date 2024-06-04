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

@Controller('app-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  @Roles(Role.Admin)
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
