import { Injectable } from '@nestjs/common';
import { ConfigService as NextConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from 'src/common/schemas/envs.schema';

@Injectable()
export class ConfigService {
  constructor(
    private nestConfigService: NextConfigService<EnvironmentVariablesType>,
  ) {}

  get<K extends keyof EnvironmentVariablesType>(
    key: K,
  ): EnvironmentVariablesType[K] {
    return this.nestConfigService.get(key, {
      infer: true,
    }) as EnvironmentVariablesType[K];
  }

  getJwtCookieExpiryTime(): Date {
    const tokenExpiresInDays = Number(this.get('JWT_COOKIE_EXPIRES_IN'));
    return new Date(Date.now() + tokenExpiresInDays * 24 * 60 * 60 * 1000);
  }

  getJwtExpiryString(): string {
    const tokenExpiresInDays = Number(this.get('JWT_COOKIE_EXPIRES_IN'));
    return `${tokenExpiresInDays}d`;
  }
}
