import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'Username of the user',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'Password for the user account',
    minLength: 6,
    required: true,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    required: true,
  })
  email: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    description: 'List of roles assigned to the user',
    required: true,
  })
  readonly roles: string[];

  @IsNotEmpty()
  @ApiProperty({
    description: 'Whether the user is banned from the platform',
    required: true,
  })
  isBanned: boolean;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Whether the user has premium access',
    required: true,
  })
  isPremium: boolean;
}
// isAdmin?: boolean;
// isBanned?: boolean;
// isPremium?: boolean;
