import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Property } from 'src/modules/property/schemas/property.schema';
import { userSchemaMiddleware } from '../schemas-middleware/user.schema-middleware';
import {
  addUserMethods,
  UserMethodsType,
} from '../schemas-methods/user.schema-methods';

export type UserDocument = HydratedDocument<User> & UserMethodsType;

@Schema()
export class User {
  @Prop({ isRequired: true })
  firstName: string;

  @Prop({ isRequired: true, unique: true })
  username: string;

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
  passwordConfirm: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Property' }],
    default: [],
  })
  properties: Property[];
}

export const UserSchema = SchemaFactory.createForClass(User);
userSchemaMiddleware(UserSchema);
addUserMethods(UserSchema);
