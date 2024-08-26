import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;
  app.use(helmet());
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
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalInterceptors(new TimeoutInterceptor());
  await app.listen(port);
}
bootstrap();
