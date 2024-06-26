import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop({ required: true })
  @ApiProperty({
    description: 'User ID associated with this history record',
    example: '123456',
  })
  userId: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Prompt asked by the user',
    example: `Marie 40 ans mère de 2 enfants, veut acheter une nouvelle voiture qu'elle compte utiliser en daily pour aller ses enfants à l'école, faire les courses etc. Quelle voiture recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 4 et 10).`,
  })
  prompt: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Response given to the prompt',
    example: `
    [
        {
            "make": "Toyota",
            "makeId": 999999,
            "model": "Corolla",
            "modelId": 999999,
            "year": 2020,
            "price": 22000,
            "consumption": 6,
            "fuel_cost": 1.6,
            "annual_maintenance": 400,
            "registration_cost": 200,
            "estimated_insurance": 800,
            "max_km": 300000,
            "description": "Reliable family car with good fuel efficiency and low maintenance costs."
        },
        
        {
            "make": "Ford",
            "makeId": 999999,
            "model": "Focus",
            "modelId": 999999,
            "year": 2018,
            "price": 18000,
            "consumption": 6.5,
            "fuel_cost": 1.7,
            "annual_maintenance": 500,
            "registration_cost": 200,
            "estimated_insurance": 700,
            "max_km": 200000,
            "description": "Compact and affordable family car with reasonable fuel efficiency."
        },
        {
            "make": "Kia",
            "makeId": 999999,
            "model": "Soul",
            "modelId": 999999,
            "year": 2018,
            "price": 19000,
            "consumption": 6.7,
            "fuel_cost": 1.75,
            "annual_maintenance": 550,
            "registration_cost": 200,
            "estimated_insurance": 750,
            "max_km": 200000,
            "description": "Quirky and practical family car with good cargo space."
        },
       
    ]`,
  })
  response: string;

  @Prop({ default: Date.now })
  @ApiProperty({
    description: `'The date and time when the record was created'`,
    example: '2021-07-21T17:32:28Z',
  })
  createdAt: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
