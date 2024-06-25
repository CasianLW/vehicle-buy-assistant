import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAppSettingsDto {
  @IsString()
  @ApiProperty({
    description: 'AI selection preference',
    required: true,
  })
  aiSelected: string;

  @IsString()
  @ApiProperty({
    description: 'Model selected for Mistral',
    required: true,
  })
  modelForMistral: string;

  @IsString()
  @ApiProperty({
    description: 'Model selected for OpenAI',
    required: true,
  })
  modelForOpenAI: string;

  @IsString()
  @ApiProperty({
    description: 'Model selected for Claude',
    required: true,
  })
  modelForClaude: string;
}
