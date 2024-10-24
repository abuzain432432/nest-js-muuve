import * as path from 'path';
import * as fs from 'fs';
import { Module, Global } from '@nestjs/common';
import { ConfigModule as NextConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import envSchema from 'src/common/schemas/envs.schema';
const envFilePath = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return path.resolve('./.env.local');
    case 'production':
      return path.resolve('./.env.prod');
    default:
      return path.resolve('./.env.test');
  }
};

// Function to check if the environment file exists
const envFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

@Global()
@Module({
  imports: [
    NextConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: envSchema,
      envFilePath: envFileExists(envFilePath()) ? envFilePath() : undefined,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
