import * as path from 'path';
const isDevEnvironment = process.env.NODE_ENV === 'development';
import * as Joi from 'joi';
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
});
export default () => {
  return {
    isGlobal: true,
    cache: true,
    expandVariables: true, //NOTE This is required to enable the variable extension in the environments variables file like this ${database}/xyz,
    envFilePath: isDevEnvironment
      ? path.resolve(__dirname, '../../../.env.local.database')
      : path.resolve(__dirname, '../../../.env.prod.database'),
    validationSchema: envSchema,
  };
};
export type EnvironmentVariablesType = {
  NODE_ENV: 'development' | 'production';
  MONGODB_URL: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
};
