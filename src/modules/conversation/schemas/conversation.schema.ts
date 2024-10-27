import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { HydratedDocument } from "mongoose";

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: String, ref: "Message" })
  lastMessage: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: true })
  seen: boolean;

  @Prop({ default: 0 })
  totalUnreadMessages: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
