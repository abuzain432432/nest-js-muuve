import * as bcrypt from "bcryptjs";
import { Schema } from "mongoose";
import { AuthProvidersEnum } from "src/common/enums/auth-providers.enum";

export function userSchemaMiddleware(schema: Schema) {
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // This is a workaround to avoid the password hashing when provider is GOOGLE
    if (this.provider === AuthProvidersEnum.GOOGLE) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });
}
