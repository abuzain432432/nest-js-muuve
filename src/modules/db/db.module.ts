import { Module, Global } from '@nestjs/common';
import { ConfigService } from 'src/modules/config/config.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbUlr = configService.get('MONGODB_URL');
        return {
          uri: dbUlr,
        };
      },
    }),
  ],
})
export class DBModule {}
