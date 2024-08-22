import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbUlr = configService.get('MONGODB_URL');
        return {
          uri: dbUlr,
        };
      },
      inject: [ConfigModule],
    }),
  ],
})
export class DBModule {}
