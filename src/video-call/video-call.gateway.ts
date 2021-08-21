import { Body, Injectable, Logger, Param, Query, Req } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway(3080)
export class VideoCallGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private server;
  afterInit(server: Server) {
    this.server = server;
  }
  handleConnection(client) {
    Logger.log(client.id, 'client connected');
  }
  handleDisconnect(client) {
    Logger.log(client.id, 'client disconnected');
  }

  @SubscribeMessage('join-room')
  login(client, params) {
    console.log(`server`, params);
    Logger.log(client.id, 'client joined');
    client.join(params[0]);
    client.to(params[0]).emit('user-connected', params[1]);
  }
  @SubscribeMessage('connect')
  connectToUser(client, params: any) {
    Logger.log(client.id + ':' + params, 'client login');
  }
}
