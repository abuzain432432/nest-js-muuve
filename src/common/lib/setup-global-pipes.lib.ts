import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export function setupGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        return new BadRequestException(
          validationErrors.map((error) => Object.values(error.constraints)[0]),
        );
      },
    }),
  );
}
