import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, ref: "Message" })
  parentIdMessage: string;

  @Prop({ type: String, ref: "Conversation" })
  conversationId: string;

  @Prop({ type: String, ref: "User" })
  senderId: string;

  @Prop({ type: String, ref: "User" })
  receiverId: string;

  @Prop()
  file: string;

  @Prop({ required: true })
  meta: string;

  @Prop({ default: false })
  edited: boolean;

  // Reaction is an array of object containing message id and user id
  // So it should be free json
  @Prop({ type: mongoose.Schema.Types.Mixed })
  reaction: Record<string, any>;

  @Prop({ default: false })
  deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
