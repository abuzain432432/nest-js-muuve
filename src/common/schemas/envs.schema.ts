import * as Joi from 'joi';
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  JWT_COOKIE_EXPIRES_IN: Joi.number().required(),
  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),
  FRONTEND_EMAIL_SERVICE_URL: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEB_HOOK_SECRET: Joi.string().required(),
  FRONTEND_BASE_URL: Joi.string().required(),
});
export type EnvironmentVariablesType = {
  NODE_ENV: 'development' | 'production';
  MONGODB_URL: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  JWT_COOKIE_EXPIRES_IN: number;
  GOOGLE_AUTH_CLIENT_ID: string;
  GOOGLE_AUTH_CLIENT_SECRET: string;
  GOOGLE_AUTH_CALLBACK_URL: string;
  FRONTEND_EMAIL_SERVICE_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEB_HOOK_SECRET: string;
  FRONTEND_BASE_URL: string;
};
export default envSchema;
