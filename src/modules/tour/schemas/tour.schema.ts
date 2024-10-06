import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TourStatusEnum } from 'src/modules/tour/enums/tour-status.enum';

export type TourDocument = HydratedDocument<Tour>;

@Schema({ timestamps: true })
export class Tour {
  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: TourStatusEnum, required: true })
  status: TourStatusEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  tenant: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Property' })
  property: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  tourDate: Date;
}

export const TourSchema = SchemaFactory.createForClass(Tour);

TourSchema.index({ tenant: 1, property: 1 }, { unique: true });
