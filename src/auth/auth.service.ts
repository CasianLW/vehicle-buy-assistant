import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(
      createUserDto.username,
    );
    // console.log(existingUser);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    createUserDto.roles = createUserDto.roles || ['User'];
    createUserDto.isBanned = createUserDto.isBanned || false;
    createUserDto.isPremium = createUserDto.isPremium || false;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    return this.userService.create(createUserDto);
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
    // const email = userProfile.emails[0].value; // Or however the email is passed from the profile
    const user = await this.userService.findOrCreateOAuthUser(
      userProfile,
      provider,
    );
    if (!user) {
      throw new UnauthorizedException('User not found or created');
    }
    const payload = {
      username: user.username,
      sub: user._id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
