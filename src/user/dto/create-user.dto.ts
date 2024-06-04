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
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  @IsNotEmpty()
  readonly roles: string[];

  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  isPremium: boolean;
}
// isAdmin?: boolean;
// isBanned?: boolean;
// isPremium?: boolean;
