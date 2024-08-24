import * as bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

export function userSchemaMiddleware(schema: Schema) {
  schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });
}
