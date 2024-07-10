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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) // Apply guards as needed based on your security policy
  @Roles(Role.Admin) // Assuming only admin can view all users, modify as per your role management
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves all registered users. Accessible only by users with Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [CreateUserDto],
  }) // Assuming CreateUserDto has all fields you wish to expose for the user listing
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user and handles conflicts if the username or email already exists.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, username or email already exists',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateUserDto, description: 'Payload to create a new user' })
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
  @ApiOperation({
    summary: 'Find one user',
    description:
      'Retrieves a user by ID. Accessible only by users with Admin role.',
  })
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Update a user',
    description:
      'Updates a user by ID. Handles conflicts and not found errors. Accessible only by users with Admin role.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, username or email already exists',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto, description: 'Payload to update a user' })
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
  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes a user by ID. Handles not found errors. Accessible only by users with Admin role.',
  })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
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
