import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import * as cookieParser from 'cookie-parser';
// import helmet from 'helmet';
import { RedisIoAdapter } from './modules/ws/adapters/redis.adapter';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupGlobalPipes } from './common/lib/setup-global-pipes.lib';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableCors();
  const port = process.env.PORT;
  // app.use(helmet());

  setupGlobalPipes(app);

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalInterceptors(new TimeoutInterceptor());

  const redisIoAdapter = new RedisIoAdapter();
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter as any);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Muuve')
    .setDescription('The Muuve API docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
}

bootstrap();
