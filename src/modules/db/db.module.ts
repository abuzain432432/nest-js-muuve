import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ConfigService } from "src/modules/config/config.service";

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbUlr = configService.get("MONGODB_URL");
        return {
          uri: dbUlr,
        };
      },
    }),
  ],
})
export class DBModule {}
