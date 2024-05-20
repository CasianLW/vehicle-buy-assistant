import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  fuelType: string;

  @Prop()
  usageFrequency: number;

  @Prop()
  maintenanceCost: number;

  @Prop()
  insuranceCost: number;

  @Prop()
  additionalFeatures: string[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
