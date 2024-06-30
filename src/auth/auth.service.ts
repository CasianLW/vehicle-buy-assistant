import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  // ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserDocument } from '../schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private resetTokens = new Map<string, { code: string; expires: number }>();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload: JwtPayload = {
      username: user.username,
      userId: user._id.toHexString(),
      roles: user.roles,
      email: user.email,
      isBanned: user.isBanned,
      isPremium: user.isPremium,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // logic inside the create method
    // const existingUser = await this.userService.findByUsername(
    //   createUserDto.username,
    // );
    // if (existingUser) {
    //   throw new ConflictException('Username already exists');
    // } else {
    //   const existingUser = await this.userService.findByEmail(
    //     createUserDto.email,
    //   );
    //   if (existingUser) {
    //     throw new ConflictException('Email already exists');
    //   }
    // }

    createUserDto.roles = createUserDto.roles || ['User'];
    createUserDto.isBanned = createUserDto.isBanned || false;
    createUserDto.isPremium = createUserDto.isPremium || false;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const newUser = await this.userService.create(createUserDto);
    return this.login(newUser);
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }
    const jwtToken = await this.validateOAuthLogin(req.user, 'google');
    return { accessToken: jwtToken };
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Facebook');
    }
    const jwtToken = await this.validateOAuthLogin(req.user, 'facebook');
    return { accessToken: jwtToken };
  }

  async validateOAuthLogin(
    userProfile: any,
    provider: string,
  ): Promise<string> {
    const user = (await this.userService.findOrCreateOAuthUser(
      userProfile,
      provider,
    )) as UserDocument;
    if (!user) {
      throw new UnauthorizedException('User not found or created');
    }
    const payload = {
      username: user.username,
      userId: user._id.toHexString(),
      roles: user.roles,
      email: user.email,
      isBanned: user.isBanned,
      isPremium: user.isPremium,
    };
    return this.jwtService.sign(payload);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.resetTokens.set(email, { code, expires });
    await this.emailService.sendMail(
      email,
      'Password Reset Code',
      `Your password reset code is ${code}`,
    );
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const token = this.resetTokens.get(email);
    if (!token || token.code !== code || Date.now() > token.expires) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.userService.updatePassword(email, hashedPassword);
    this.resetTokens.delete(email);
  }
}
