import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
});
export type EnvironmentVariablesType = {
  NODE_ENV: 'development' | 'production';
  MONGODB_URL: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
};
export default envSchema;
