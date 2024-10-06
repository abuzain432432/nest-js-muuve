import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(message: Message): Promise<MessageDocument> {
    const chat = new this.messageModel({
      ...message,
    });
    return chat.save();
  }
  async findAllMessagesOfAConversationWithConId(
    conversationId: string,
  ): Promise<MessageDocument[]> {
    return this.messageModel.find({ conversationId }).exec();
  }
}
