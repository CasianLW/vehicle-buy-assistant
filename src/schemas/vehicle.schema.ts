import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true })
  make: string;
  @Prop({ required: true })
  makeId: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  fuelType: string;
  @Prop()
  consumption: number;
  @Prop()
  fuelCost: number;

  @Prop()
  maintenanceCost: number;
  @Prop()
  registrationCost: number;
  @Prop()
  insuranceCost: number;

  @Prop()
  description: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
