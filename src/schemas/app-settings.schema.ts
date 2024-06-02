import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AppSettings extends Document {
  @Prop({ required: true })
  aiSelected: string;

  @Prop()
  modelForMistral: string;

  @Prop()
  modelForOpenAI: string;

  @Prop()
  modelForClaude: string;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettings);
