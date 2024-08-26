import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Namespace } from 'socket.io';
import { MESSAGE_WS_NAMESPACE } from 'src/common/constants/index.constants';

@WebSocketGateway(3001, { namespace: MESSAGE_WS_NAMESPACE })
class WSGateway implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;
  private namespace: Namespace;

  afterInit(server: Server) {
    this.namespace = server.of(MESSAGE_WS_NAMESPACE);
    console.log('WebSocket server initialized and namespace set.');
  }

  @SubscribeMessage('newMessage')
  handleNewMessageEvent(@MessageBody() data: any): WsResponse<any> {
    return { event: 'events', data };
  }
}
export default WSGateway;
