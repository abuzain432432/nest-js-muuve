import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get(':id/conversationId')
  @UseGuards(JwtAuthGuard)
  findAllMessagesOfAConversation(@Param('id') id: string) {
    return this.messageService.findAllMessagesOfAConversationWithConId(id);
  }
}
