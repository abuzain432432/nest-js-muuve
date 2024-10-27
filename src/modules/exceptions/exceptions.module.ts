import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CatchAllExceptionsFilter } from 'src/common/http-exception-filters/catch-all.exception-filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchAllExceptionsFilter,
    },
  ],
})
export class ExceptionsModule {}
