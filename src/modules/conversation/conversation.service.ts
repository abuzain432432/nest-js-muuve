import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import {
  Conversation,
  ConversationDocument,
} from "./schemas/conversation.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async create() {
    const user = new this.conversationModel();
    return await user.save();
  }

  async findOneById(id: string) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || conversation.deleted) {
      throw new NotFoundException("Conversation not found");
    }
    return conversation;
  }
  async getAll() {
    return this.conversationModel.find({ deleted: false });
  }

  async delete(id: string) {
    const conversation = await this.conversationModel.findById(id);
    conversation.deleted = true;
    return conversation.save();
  }
}
