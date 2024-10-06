import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Property } from 'src/modules/property/schemas/property.schema';
import { userSchemaMiddleware } from 'src/modules/user/schemas-middleware/user.schema-middleware';
import {
  addUserMethods,
  UserMethodsType,
} from 'src/modules/user/schemas-methods/user.schema-methods';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { AuthProvidersEnum } from 'src/common/enums/auth-providers.enum';

export type UserDocument = HydratedDocument<User> & UserMethodsType;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: false, isRequired: true })
  active: boolean;

  @Prop({ isRequired: true })
  firstName: string;

  @Prop({ isRequired: true })
  password: string;

  @Prop({ isRequired: true })
  lastName: string;

  @Prop({
    isRequired: true,
    validate: {
      validator: function (this: User, value: string) {
        return value === this.password;
      },
      message: 'Password and confirm password do not match',
    },
  })
  // TODO you still storing it a plain text in the database either hash it or remove it in the middleware
  passwordConfirm: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Property' }],
    default: [],
  })
  properties: Property[];

  @Prop({ type: String, enum: RolesEnum, required: true })
  role: RolesEnum;

  @Prop({ type: String, enum: AuthProvidersEnum, required: true })
  provider: AuthProvidersEnum;

  @Prop({ type: String, default: '' })
  otp: string;

  @Prop({ type: Date, default: null })
  otpExpiresAt: Date;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  tfa: boolean;

  @Prop({ default: '' })
  tfaSecret: string;

  @Prop({ default: '' })
  tfaRecoveryToken: string;

  @Prop({ type: String, default: '' })
  subscriptionId: string;
  @Prop({ type: Date, default: null })
  currentPeriodEnd: Date;
  @Prop({ type: Date, default: null })
  currentPeriodStart: Date;
  @Prop({ type: String, default: '' })
  customerId: string;
  @Prop({ type: String, default: '' })
  planName: string;

  @Prop({ type: String, default: '' })
  interval: string;

  @Prop({ type: String, default: '' })
  subscriptionStatus: string;

  @Prop({ type: String, default: '' })
  invoiceStatus: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
userSchemaMiddleware(UserSchema);
addUserMethods(UserSchema);
