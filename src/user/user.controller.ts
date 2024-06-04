import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  BadRequestException,
  ConflictException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully created',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User successfully updated',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
