import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true })
  @ApiProperty({ description: 'Make of the vehicle', example: 'Toyota' })
  make: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Unique identifier for the vehicle make',
    example: 'toyota',
  })
  makeId: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Model of the vehicle', example: 'Corolla' })
  carModel: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Year of manufacture', example: 2020 })
  year: number;

  @Prop({ required: true })
  @ApiProperty({ description: 'Price of the vehicle in USD', example: 20000 })
  price: number;

  @Prop()
  @ApiProperty({
    description: 'Type of fuel used by the vehicle',
    example: 'Gasoline',
    required: false,
  })
  fuelType: string;

  @Prop()
  @ApiProperty({
    description: 'Fuel consumption in liters per 100 km',
    example: 6.5,
    required: false,
  })
  consumption: number;

  @Prop()
  @ApiProperty({
    description: 'Annual fuel cost in USD',
    example: 1500,
    required: false,
  })
  fuelCost: number;

  @Prop()
  @ApiProperty({
    description: 'Annual maintenance cost in USD',
    example: 500,
    required: false,
  })
  maintenanceCost: number;

  @Prop()
  @ApiProperty({
    description: 'Annual registration cost in USD',
    example: 300,
    required: false,
  })
  registrationCost: number;

  @Prop()
  @ApiProperty({
    description: 'Annual insurance cost in USD',
    example: 1200,
    required: false,
  })
  insuranceCost: number;

  @Prop()
  @ApiProperty({
    description: 'Description of the vehicle',
    example: 'A reliable family car.',
    required: false,
  })
  description: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
