import * as path from 'path';
import { Module, Global } from '@nestjs/common';
import { ConfigModule as NextConfigModule } from '@nestjs/config';
const isDevEnvironment = process.env.NODE_ENV === 'development';
import { ConfigService } from './config.service';
import envSchema from 'src/common/schemas/envs.schema';

@Global()
@Module({
  imports: [
    NextConfigModule.forRoot({
      cache: true,
      expandVariables: true, //NOTE This is required to enable the variable extension in the environments variables file like this ${database}/xyz,
      envFilePath: isDevEnvironment
        ? path.resolve('./.env.local.database')
        : path.resolve('./.env.prod.database'),
      validationSchema: envSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
