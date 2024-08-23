import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  JWT_COOKIE_EXPIRES_IN: Joi.number().required(),
});
export type EnvironmentVariablesType = {
  NODE_ENV: 'development' | 'production';
  MONGODB_URL: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  JWT_COOKIE_EXPIRES_IN: number;
};
export default envSchema;
