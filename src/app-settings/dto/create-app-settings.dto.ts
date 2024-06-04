import { IsString } from 'class-validator';

export class CreateAppSettingsDto {
  @IsString()
  aiSelected: string;

  @IsString()
  modelForMistral: string;

  @IsString()
  modelForOpenAI: string;

  @IsString()
  modelForClaude: string;
}
