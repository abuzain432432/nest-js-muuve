import * as path from 'path';
import { Module, Global } from '@nestjs/common';
import { ConfigModule as NextConfigModule } from '@nestjs/config';
// const isDevEnvironment = process.env.NODE_ENV === 'development';
// const isTestEnvironment = process.env.NODE_ENV === 'test';
import { ConfigService } from './config.service';
import envSchema from 'src/common/schemas/envs.schema';

@Global()
@Module({
  imports: [
    NextConfigModule.forRoot({
      cache: true,
      expandVariables: true, //NOTE This is required to enable the variable extension in the environments variables file like this ${database}/xyz,
      // envFilePath: path.resolve('./.env.test'),
      envFilePath: path.resolve('./.env.local'),

      // envFilePath: isDevEnvironment
      //   ? path.resolve('./.env.local')
      //   : isTestEnvironment
      //     ? path.resolve('./.env.test')
      //     : path.resolve('./.env.prod'),
      validationSchema: envSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
