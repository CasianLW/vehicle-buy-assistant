import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Username of the user, must be unique.',
    example: 'john_doe',
    required: true,
    uniqueItems: true,
  })
  username: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Password for the user account, stored securely.',
    example: 'securePassword123!',
    required: true,
    type: 'string',
    format: 'password',
  })
  password: string;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Email address of the user, must be unique.',
    example: 'john.doe@example.com',
    required: true,
    uniqueItems: true,
  })
  email: string;

  @Prop({ default: false })
  @ApiProperty({
    description: 'Indicates whether the user is banned.',
    example: false,
    required: false,
    type: 'boolean',
  })
  isBanned: boolean;

  @Prop({ default: false })
  @ApiProperty({
    description: 'Indicates whether the user has premium access.',
    example: false,
    required: false,
    type: 'boolean',
  })
  isPremium: boolean;

  @Prop({ type: [String], default: ['user'] })
  @ApiProperty({
    description: 'Roles assigned to the user.',
    example: ['user', 'admin'],
    required: false,
    isArray: true,
    type: 'string',
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
