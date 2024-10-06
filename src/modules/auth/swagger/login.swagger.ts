import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { DUMMY_USER } from '@mock';

export function LoginSwagger() {
  return applyDecorators(
    ApiBody({
      description:
        'User credentials for login. If TFA is enabled, OTP is required.',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password123' },
          otp: {
            type: 'string',
            example: '123456',
            description: 'OTP for TFA (only required if TFA is enabled)',
          },
        },
        required: ['email', 'password'],
      },
    }),
    ApiOkResponse({
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' },
          user: {
            type: 'object',
            example: { DUMMY_USER },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Invalid credentials or OTP required',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request - Missing or invalid OTP',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid OTP token' },
        },
      },
    }),
  );
}
