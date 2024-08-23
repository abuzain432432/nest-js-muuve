import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ required: true })
  name: string;

  @Prop()
  buildingName: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
