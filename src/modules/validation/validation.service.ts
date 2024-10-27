import { Injectable, BadRequestException } from '@nestjs/common';

import { validateOrReject } from 'class-validator';

@Injectable()
export class ValidationService {
  async validateDto<T>(dtoClass: new () => T, data: Partial<T>): Promise<void> {
    const dto = Object.assign(new dtoClass(), data);
    try {
      await validateOrReject(dto);
    } catch (errors) {
      // TODO use the logger service to log the errors and send the errors to the sentry and hence to slack channel and use data, error.message to log the error
      throw new BadRequestException('Validation failed', errors);
    }
  }
}
