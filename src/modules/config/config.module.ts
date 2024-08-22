import * as path from 'path';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NextConfigModule } from '@nestjs/config';
const isDevEnvironment = process.env.NODE_ENV === 'development';
import { ConfigService } from './config.service';
import envSchema from 'src/common/schemas/envs.schema';

@Module({})
export class ConfigModule {
  // NOTE: THis is only for demonstration purposes, in real world applications, you should used static module registration
  static register(): DynamicModule {
    return {
      imports: [
        NextConfigModule.forRoot({
          cache: true,
          expandVariables: true, //NOTE This is required to enable the variable extension in the environments variables file like this ${database}/xyz,
          envFilePath: isDevEnvironment
            ? path.resolve(__dirname, '../../../.env.local.database')
            : path.resolve(__dirname, '../../../.env.prod.database'),
          validationSchema: envSchema,
        }),
      ],
      providers: [ConfigService],
      module: ConfigModule,
    };
  }
}
