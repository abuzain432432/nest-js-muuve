import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { HydratedDocument } from "mongoose";
import { PropertyStatusEnum } from "src/modules/property/enums/property-status.enum";
import { PropertyTypeEnum } from "src/modules/property/enums/property-type-enum";

export type PropertyDocument = HydratedDocument<Property>;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  facilities: string[];

  @Prop({ type: [String] })
  photos: string[];

  @Prop({
    type: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
  })
  scheduleTime: {
    from: Date;
    to: Date;
  };

  @Prop({
    type: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
  })
  schedulePeriod: {
    from: Date;
    to: Date;
  };

  @Prop({
    type: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
  })
  leasePeriod: {
    from: Date;
    to: Date;
  };

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  favoritesBy: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  owner: mongoose.Types.ObjectId;

  @Prop({
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true, index: "2dsphere" },
  })
  location: {
    type: "Point";
    coordinates: [number, number];
  };

  @Prop({
    type: {
      cShape: {
        type: { type: String, enum: ["Polygon"], required: true },
        coordinates: { type: [[Number]], required: true },
      },
      pShape: {
        type: { type: String, enum: ["Polygon"], required: true },
        coordinates: { type: [[Number]], required: true },
      },
    },
  })
  shapes: {
    cShape: { type: "Polygon"; coordinates: number[][][] };
    pShape: { type: "Polygon"; coordinates: number[][][] };
  };

  @Prop()
  buildingName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  area: number;

  @Prop({ default: false })
  catsAllowed: boolean;

  @Prop({ default: 0 })
  catsLimit: number;

  @Prop({ default: false })
  dogsAllowed: boolean;

  @Prop({ default: 0 })
  dogsLimit: number;

  @Prop({ default: "" })
  petsComment: string;

  @Prop({ default: false })
  carPort: boolean;

  @Prop({ type: String, enum: PropertyStatusEnum, required: true })
  status: PropertyStatusEnum;

  @Prop({ type: String, enum: PropertyTypeEnum, required: true })
  type: PropertyTypeEnum;

  @Prop({ type: Date, default: Date.now })
  listedAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
