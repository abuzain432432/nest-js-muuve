import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { UserResponseDto } from 'src/common/dtos/user-response.dto';

export function LoginSwagger() {
  return applyDecorators(
    ApiBody({
      description: 'User credentials for login.',
      schema: {
        oneOf: [
          {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@example.com' },
              password: { type: 'string', example: 'password123' },
            },
            required: ['email', 'password'],
            description: 'Login without OTP',
          },
          {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@example.com' },
              password: { type: 'string', example: 'password123' },
              otp: {
                type: 'string',
                example: '123456',
                description: 'OTP for TFA (required if TFA is enabled)',
              },
            },
            required: ['email', 'password', 'otp'],
            description: 'Login with OTP',
          },
        ],
      },
    }),
    ApiOkResponse({
      description: 'Login successful',
      type: UserResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Invalid OTP',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid 2FA token' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid credentials' },
        },
      },
    }),
  );
}
