import { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
export function addUserMethods(schema: Schema) {
  schema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
}

export type UserMethodsType = {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
};
