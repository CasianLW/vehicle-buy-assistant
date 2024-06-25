import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Registers a new user by encrypting the password and then creating a user record. Throws a conflict exception if username already exists.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, username already exists.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload to create a new user.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user based on username and password and returns an access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: 'object',
    schema: {
      properties: {
        access_token: { type: 'string', description: 'JWT access token' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid credentials.',
  })
  @ApiBody({ type: LoginDto, description: 'Credentials needed to login' })
  // async login(@Request() req) {
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
    // return this.authService.login(req.user);
  }
}
