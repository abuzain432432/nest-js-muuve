import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { AuthProvidersEnum } from "src/common/enums/auth-providers.enum";
import { RolesEnum } from "src/common/enums/roles.enum";
import { v4 as uuidv4 } from "uuid";

import { User } from "../schemas/user.schema";

const baseUser = {
  firstName: "John",
  lastName: "Doe",
  role: RolesEnum.AGENT,
  provider: AuthProvidersEnum.CUSTOM,
  tfa: true,
  properties: [],
  active: true,
  password: "password",
  passwordConfirm: "password",
};
@Injectable()
export class TestDataFactory {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async createUser(
    attributes: Partial<Omit<User, "email">>,
    persistToDb: boolean = false,
  ): Promise<User> {
    const user = new this.userModel({
      ...attributes,
      email: `test-${uuidv4()}@test.com`,
    });

    return persistToDb ? await user.save() : user;
  }

  async createCustomProviderActiveUser(
    overrides: Partial<User> = {},
    persistToDb: boolean = false,
  ): Promise<User> {
    const defaultUser = {
      ...baseUser,
      ...overrides,
      active: true,
    };
    return await this.createUser(defaultUser, persistToDb);
  }

  async createInactiveUser(
    overrides: Partial<User> = {},
    persistToDb: boolean = false,
  ): Promise<User> {
    const defaultUser = {
      ...baseUser,
      ...overrides,
      active: false,
    };
    return await this.createUser(defaultUser, persistToDb);
  }

  async createGoogleUser(
    overrides: Partial<User> = {},
    persistToDb: boolean = false,
  ): Promise<User> {
    const defaultUser = {
      ...baseUser,
      ...overrides,
      provider: AuthProvidersEnum.GOOGLE,
    };
    return await this.createUser(defaultUser, persistToDb);
  }

  async createCustomProviderInActiveUser(
    overrides: Partial<User> = {},
    persistToDb: boolean = false,
  ): Promise<User> {
    const defaultUser = {
      ...baseUser,
      ...overrides,
      provider: AuthProvidersEnum.CUSTOM,
      active: false,
    };
    return await this.createUser(defaultUser, persistToDb);
  }
}
