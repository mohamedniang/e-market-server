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
  private infos = [];
  private allClients: any[] = [];

  clearRoom() {
    for (const room of this.infos) {
      if (room.users.length == 0)
        this.infos.splice(this.infos.indexOf(room), 1);
    }
  }

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client) {
    Logger.log(client.id, 'client connected');
    this.allClients.push(client);
    this.clearRoom();
  }

  handleDisconnect(client) {
    Logger.log(client.id, 'client disconnected');
    this.allClients.splice(this.allClients.indexOf(client), 1);
    this.clearRoom();

    this.infos.forEach((room) => {
      if (room.users.length >= 1) {
        const user = room.users.find((user) => user.clientId == client.id);
        if (user) {
          client.to(room.roomId).emit('user-disconnected', user.peerId);
          const index = room.users.indexOf(user);
          room.users.splice(index, 1);
        }
      }
    });
    console.log('infos when client quit', this.infos);
  }

  @SubscribeMessage('join-room')
  login(client, params) {
    console.log(`server`, params);
    Logger.log(client.id, 'client joined');
    this.clearRoom();
    const existingRoom = this.infos.find(
      (inf) => inf && inf.roomId === params[0],
    );
    if (existingRoom) {
      if (existingRoom.users.length == 2) {
        client.emit('room-max-user');
        return;
      } else if (existingRoom.users.length == 1) {
        existingRoom.users.push({ clientId: client.id, peerId: params[1] });
        const userInClientList = this.allClients.find(
          (userConnected) => userConnected.id == existingRoom.users[0].clientId,
        );
        if (userInClientList && existingRoom.users[0].clientId != client.id) {
          client.emit('user-in-room', existingRoom.users[0].peerId);
        }
      } else {
        existingRoom.users.push({ clientId: client.id, peerId: params[1] });
      }
    } else {
      const data = {
        roomId: params[0],
        users: [{ clientId: client.id, peerId: params[1] }],
      };
      this.infos.push(data);
    }
    console.log('infos when client joined room', this.infos);
    client.join(params[0]);
    client.to(params[0]).emit('user-connected', params[1]);
  }

  @SubscribeMessage('disconnect-user')
  disconnect(client, params: any) {
    Logger.log(client.id + ':' + params, 'client disconnected');
    client.join(params[0]);
    client.to(params[0]).emit('user-disconnected', params[1]);
    this.clearRoom();

    const room = this.infos.find((inf) => inf && inf.roomId === params[0]);
    if (room) {
      const userExist = room.users.find(
        (user) => user.clientId == client.id && user.peerId == params[1],
      );
      const index = room.users.indexOf(userExist);
      room.users.splice(index, 1);
    }
    console.log('infos when client disconnected', this.infos);
  }
}
