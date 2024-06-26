import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      // console.error('Existing user:', existingUser); // Log existing user
      // console.log('All users:', await this.userModel.find()); // Log all users
      throw new ConflictException('Username or email already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    // if (!user) {
    //   throw new NotFoundException(`User with username ${username} not found`);
    // }
    // return user;
    return user || null;
  }
  async findOrCreateOAuthUser(profile: any, provider: string): Promise<User> {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;
    if (!email) {
      throw new Error('Email is required for OAuth registration');
    }

    let user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      const password = await bcrypt.hash(profile.id + provider, 10); // Using provider in hash for added uniqueness
      user = new this.userModel({
        username: profile.displayName || profile.username || email,
        email,
        password: password,
      });
      await user.save();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        $or: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User successfully deleted' };
  }
}
