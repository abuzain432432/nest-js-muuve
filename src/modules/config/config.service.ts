import { Injectable } from '@nestjs/common';
import { ConfigService as NextConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from 'src/common/config/envConfig';

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
}
