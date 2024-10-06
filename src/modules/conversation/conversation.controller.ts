import { Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create() {
    return this.conversationService.create();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.conversationService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([RolesEnum.ADMIN])
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.conversationService.findOneById(id);
  }
}
