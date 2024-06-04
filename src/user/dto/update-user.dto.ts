import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsArray,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  readonly username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  readonly password?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsArray()
  @IsOptional()
  readonly roles?: string[];

  @IsOptional()
  readonly isBanned?: boolean;

  @IsOptional()
  readonly isPremium?: boolean;
}
