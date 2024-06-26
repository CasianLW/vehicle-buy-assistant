import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Get,
  Req,
  BadRequestException,
  ConflictException,
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
// import { RateLimit } from 'nestjs-rate-limiter';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
    type: ConflictException,
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
    type: UnauthorizedException,
  })
  @ApiBody({ type: LoginDto, description: 'Credentials needed to login' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
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

  @Public()
  // @RateLimit({ points: 10, duration: 60 * 60 }) // 10 requests per hour
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot Password',
    description:
      "Requests a password reset code to be sent to the user's email.",
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent to email.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, email not found.',
    type: UnauthorizedException,
  })
  @ApiBody({
    type: ForgotPasswordDto,
    description: 'Email address to send the password reset code.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Password reset code sent to email' };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset Password',
    description:
      "Resets the password using the reset code sent to the user's email.",
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid reset code or passwords do not match.',
    type: BadRequestException,
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Payload to reset password.',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );
    return { message: 'Password reset successfully' };
  }
}
