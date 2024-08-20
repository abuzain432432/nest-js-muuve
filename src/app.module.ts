import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IpMiddleware } from './common/middlewares/ip.middleware';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import envConfig, { EnvironmentVariablesType } from './common/config/envConfig';
@Module({
  imports: [
    ConfigModule.forRoot({
      ...envConfig(),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariablesType>,
      ) => {
        const dbUlr = configService.get('MONGODB_URL', { infer: true });
        return {
          uri: dbUlr,
        };
      },
      inject: [ConfigService<EnvironmentVariablesType>],
    }),
    AuthModule,
    UsersModule,
    ExceptionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
  }
}
