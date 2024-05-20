import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
