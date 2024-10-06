import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MessageModule } from 'src/modules/message/message.module';
import { ConversationModule } from 'src/modules/conversation/conversation.module';
import { WSService } from './ws.service';
import { WSGateway } from './ws.gateway';
import { RedisIoAdapter } from './adapters/redis.adapter';

@Module({
  providers: [RedisIoAdapter, WSGateway, WSService],
  imports: [AuthModule, ConversationModule, MessageModule],
})
export class WSModule {}
