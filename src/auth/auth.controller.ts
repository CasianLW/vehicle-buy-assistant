import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Google OAuth Login',
    description: 'Redirects to Google for authentication.',
  })
  @ApiResponse({ status: 302, description: 'Redirect to Google.' })
  async googleAuth() {
    // Passport handles the redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Google OAuth Callback',
    description: 'Handles the callback from Google OAuth.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful, returns JWT.',
  })
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Facebook OAuth Login',
    description: 'Redirects to Facebook for authentication.',
  })
  @ApiResponse({ status: 302, description: 'Redirect to Facebook.' })
  async facebookAuth() {
    // Passport handles the redirect
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Facebook OAuth Callback',
    description: 'Handles the callback from Facebook OAuth.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful, returns JWT.',
  })
  async facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req);
  }
}
