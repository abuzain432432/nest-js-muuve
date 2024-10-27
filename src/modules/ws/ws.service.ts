import { Injectable, OnModuleInit, Inject } from "@nestjs/common";

import { RedisClientType } from "redis";
import { Server } from "socket.io";
import { CreateMessageDto } from "src/modules/message/dtos/create.dto";
import { MessageService } from "src/modules/message/message.service";
import { Message } from "src/modules/message/schemas/message.schema";

import { RedisIoAdapter } from "./adapters/redis.adapter";
import { TypingEventDto } from "./dtos/typing-event.dto";

@Injectable()
export class WSService implements OnModuleInit {
  private pubClient: RedisClientType;
  private subClient: RedisClientType;
  private server: Server;

  constructor(
    @Inject(RedisIoAdapter) private readonly redisIoAdapter: RedisIoAdapter,
    private messageService: MessageService,
  ) {}

  setServer(server: Server): void {
    this.server = server;
  }

  async onModuleInit(): Promise<void> {
    try {
      this.pubClient = this.redisIoAdapter.getPubClient();
      this.subClient = this.redisIoAdapter.getSubClient();
      this.subClient.on("error", (error) => {
        console.log("Redis subscription error:", error);
      });

      this.subClient.subscribe(
        "private_messages",
        this.handlePrivateMessage.bind(this),
      );

      this.subClient.subscribe(
        "private_typing",
        this.handleTypingEvent.bind(this),
      );
    } catch (error) {
      console.error("Error initializing WSService:", error);
    }
  }

  private async handleTypingEvent(message: any) {
    // socketId, message
    const {
      recipientSocketId: socketId,
      ...restOfMessageData
    }: TypingEventDto & { recipientSocketId: string } = JSON.parse(message);
    console.log("NEW TYPING EVENT ARRIVED AT WS SERVICE SUBSCRIBER");
    console.log(restOfMessageData);

    const socket = this.server.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit("onTyping", {
        userId: restOfMessageData.senderId,
        isTyping: true,
      });
    }
  }
  async handlePrivateMessage(message: any) {
    const {
      socketId,
      message: msg,
    }: {
      socketId: string;
      message: CreateMessageDto;
    } = JSON.parse(message);
    console.log("NEW MESSAGE ARRIVED AT WS SERVICE SUBSCRIBER");
    console.log(msg);

    const socket = this.server.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit("onMessage", msg);
    }
    this.messageService.create(msg as Message);
  }

  async publishMessage(
    socketId: string,
    message: CreateMessageDto,
  ): Promise<void> {
    await this.pubClient.publish(
      "private_messages",
      JSON.stringify({ socketId, ...message }),
    );
  }
  // create a method publishTypingEvent
  async publishTypingEvent(
    data: TypingEventDto & { recipientSocketId: string },
  ): Promise<void> {
    console.log("+++++++++++++BEFORE PUBLHING++++++++++++++");
    console.log({ ...data });
    await this.pubClient.publish("private_typing", JSON.stringify({ ...data }));
  }
}
