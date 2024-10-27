import { Injectable } from "@nestjs/common";
import { ConfigService as NextConfigService } from "@nestjs/config";

import {
  FIVE_MINUTES_IN_MILLISECONDS,
  FIVER_SECONDS_IN_MILLISECONDS,
  ONE_THOUSAND_JOBS,
  QUEUE_JOBS_ATTEMPTS_In_CASE_OF_FAILURE,
} from "src/common/constants";
import { EnvironmentVariablesType } from "src/common/schemas/envs.schema";

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
    const tokenExpiresInDays = Number(this.get("JWT_COOKIE_EXPIRES_IN"));
    return new Date(Date.now() + tokenExpiresInDays * 24 * 60 * 60 * 1000);
  }

  getJwtExpiryString(): string {
    const tokenExpiresInDays = Number(this.get("JWT_COOKIE_EXPIRES_IN"));
    return `${tokenExpiresInDays}d`;
  }
  getQueueJobConfigOptions() {
    return {
      attempts: QUEUE_JOBS_ATTEMPTS_In_CASE_OF_FAILURE,
      backoff: { type: "fixed", delay: FIVER_SECONDS_IN_MILLISECONDS },
      removeOnComplete: {
        age: FIVE_MINUTES_IN_MILLISECONDS,
        count: ONE_THOUSAND_JOBS,
      },
      removeOnFail: { count: ONE_THOUSAND_JOBS },
    };
  }
}
