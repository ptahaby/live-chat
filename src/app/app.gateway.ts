import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendsMessage(
    client: Socket,
    payload: Prisma.ChatCreateInput,
  ): Promise<void> {
    await this.appService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(client: any) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Disconnect: ${client.id}`);
  }
}
