import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class AppSettings extends Document {
  @Prop({ required: true })
  @ApiProperty({
    description: 'Selected AI technology',
    required: true,
    example: 'mistral',
  })
  aiSelected: string;

  @Prop()
  @ApiProperty({
    description: 'Model used for Mistral AI',
    required: false,
    example: 'open-mistral-7b',
  })
  modelForMistral: string;

  @Prop()
  @ApiProperty({
    description: 'Model used for OpenAI',
    required: false,
    example: 'gpt-3.5-turbo',
  })
  modelForOpenAI: string;

  @Prop()
  @ApiProperty({
    description: 'Model used for Claude AI',
    required: false,
    example: 'claude-3-haiku-20240307',
  })
  modelForClaude: string;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettings);
