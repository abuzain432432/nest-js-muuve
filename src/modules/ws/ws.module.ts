import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';
import { ConversationModule } from 'src/modules/conversation/conversation.module';
import { MessageModule } from 'src/modules/message/message.module';

import { RedisIoAdapter } from './adapters/redis.adapter';
import { WSGateway } from './ws.gateway';
import { WSService } from './ws.service';

@Module({
  providers: [RedisIoAdapter, WSGateway, WSService],
  imports: [AuthModule, ConversationModule, MessageModule],
})
export class WSModule {}
