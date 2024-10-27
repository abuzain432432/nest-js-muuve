import {
  UsePipes,
  ValidationPipe,
  UseFilters,
  BadRequestException,
} from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { WsCatchAllExceptionsFilter } from "src/common/ws-exception-filters/catch-all.exception-filter";
import { AuthService } from "src/modules/auth/auth.service";
import { CreateMessageDto } from "src/modules/message/dtos/create.dto";

import { RedisIoAdapter } from "./adapters/redis.adapter";
import { TypingEventDto } from "./dtos/typing-event.dto";
import { AuthWsMiddleware } from "./middlewares/ws-auth.middleware";
import { AuthenticatedSocket } from "./types/socket-io.types";
import { WSService } from "./ws.service";

@UseFilters(WsCatchAllExceptionsFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (validationErrors = []) => {
      console.log("VALIDATION FAILED++++++++++++++++++++++");
      console.log(validationErrors);
      return new BadRequestException(
        validationErrors.map((error) => Object.values(error.constraints)[0]),
      );
    },
  }),
)
@WebSocketGateway(3001)
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private wsService: WSService,
    private redisIoAdapter: RedisIoAdapter,
  ) {}

  async afterInit(@ConnectedSocket() socket: Socket) {
    socket.use(AuthWsMiddleware(this.authService) as any);
    this.wsService.setServer(this.server);
  }

  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.user._id.toString();
    const socketId = client.id;

    // Add the socket ID to Redis
    await this.redisIoAdapter
      .getPubClient()
      .sAdd("connected_clients", socketId);
    await this.redisIoAdapter.getPubClient().set(`user:${userId}`, socketId);

    // console.log(`Set user:${userId} = ${socketId}`);
    // console.log(
    // 'All connected clients: on connect',
    // await this.redisIoAdapter.getAllConnectedClients(),
    // );
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.user._id.toString();
    const socketId = client.id;

    // Remove the socket ID from Redis
    await this.redisIoAdapter
      .getPubClient()
      .sRem("connected_clients", socketId);
    await this.redisIoAdapter.getPubClient().del(`user:${userId}`);

    console.log(`Removed user:${userId} = ${socketId}`);
    // console.log(
    //   'All connected  clients: list on Disconnect',
    //   await this.redisIoAdapter.getAllConnectedClients(),
    // );
  }

  @SubscribeMessage("new")
  async handlePrivateMessage(@MessageBody() newMessage: CreateMessageDto) {
    console.log("+++++++++++++ MESSAGE RECEIVED +++++++++++++++++++");
    console.log(newMessage);

    const redisKey = `user:${newMessage.receiverId}`;

    const recipientSocketId = await this.redisIoAdapter
      .getPubClient()
      .get(redisKey);

    await this.wsService.publishMessage(recipientSocketId, newMessage);
  }
  // create a new method to handle the typing event
  @SubscribeMessage("typing")
  async handleTypingEvent(@MessageBody() data: TypingEventDto) {
    console.log("+++++++++++++ TYPING RECEIVED +++++++++++++++++++");
    console.log(data);

    const redisKey = `user:${data.receiverId}`;

    const recipientSocketId = await this.redisIoAdapter
      .getPubClient()
      .get(redisKey);
    // if the recipient is not connected, do nothing meaning recipient is offline
    if (!recipientSocketId) {
      return;
    }

    await this.wsService.publishTypingEvent({ recipientSocketId, ...data });
  }
}
