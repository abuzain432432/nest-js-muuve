import { AuthProvidersEnum } from "src/common/enums/auth-providers.enum";
import { RolesEnum } from "src/common/enums/roles.enum";
import { Property } from "src/modules/property/schemas/property.schema";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  properties: Property[];
  role: RolesEnum;
  provider: AuthProvidersEnum;
  otp: string;
  otpExpiresAt: Date;
  active: boolean;
  tfa: boolean;
  tfaSecret: string;
  tfaRecoveryToken: string;
  subscriptionId?: string;
  currentPeriodEnd?: Date;
  currentPeriodStart?: Date;
  customerId?: string;
  planName?: string;
  interval?: string;
  paymentStatus?: string;
  invoiceStatus?: string;
  subscriptionStatus?: string;
}
