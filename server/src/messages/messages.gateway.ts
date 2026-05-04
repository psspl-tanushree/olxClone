import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173', credentials: true } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token) as { sub: number };
      client.data.userId = payload.sub;
      client.join(`user-${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: number; adId: number; message: string },
  ) {
    const senderId: number = client.data.userId;
    if (!senderId) return;

    const saved = await this.messagesService.send(senderId, data.receiverId, data.adId, data.message);

    const msgPayload = {
      id: (saved as any).id,
      body: (saved as any).body,
      senderId,
      receiverId: data.receiverId,
      adId: data.adId,
      createdAt: (saved as any).createdAt,
      sender: { id: senderId, name: '' },
    };

    this.server.to(`user-${senderId}`).emit('newMessage', msgPayload);
    this.server.to(`user-${data.receiverId}`).emit('newMessage', msgPayload);
  }
}
