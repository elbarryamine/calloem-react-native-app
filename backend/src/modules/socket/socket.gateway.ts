import { InjectModel } from '@nestjs/mongoose';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Model } from 'mongoose';
import {
  RoomOfferDocument,
  RoomOffersSchemaType,
} from '../rooms/entities/room-offers.schema';
import { RoomDocument, RoomSchemaType } from '../rooms/entities/room.schema';

@WebSocketGateway({
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class SocketGateway {
  constructor(
    @InjectModel(RoomSchemaType.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomOffersSchemaType.name)
    private roomOffersModel: Model<RoomOfferDocument>,
  ) {}
  @SubscribeMessage('client:checkoffer')
  async findOffer(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomOffer = await this.roomOffersModel.findOne({ roomId: data.id });
    client.emit(`room:${data.id}:checkoffer`, {
      hasOffer: roomOffer && !!roomOffer.offer,
      offer: roomOffer ? roomOffer.offer : null,
    });
  }

  @SubscribeMessage('client:saveoffer')
  async saveRoomOffer(
    @MessageBody()
    data: {
      id: string;
      offer: any;
    },
  ) {
    await this.roomOffersModel.create({
      roomId: data.id,
      offer: data.offer,
    });
  }

  @SubscribeMessage('client:answeroffer')
  async answerRoomOffer(
    @MessageBody()
    data: {
      id: string;
      answer: any;
    },
    @ConnectedSocket() client: Socket,
  ) {
    client.emit(`room:${data.id}:answeroffer`, {
      answer: data.answer,
    });
  }

  @SubscribeMessage('client:offercandidate')
  async saveAnswerCandidate(
    @MessageBody()
    data: { id: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomOffersModel.findOne({ roomId: data.id }).updateOne({
      $addToSet: { offerCandidates: JSON.stringify(data.candidate) },
    });

    const roomOffer = await this.roomOffersModel.findOne({ roomId: data.id });

    client.emit(`room:${data.id}:candidates`, {
      answerCandidates: roomOffer.answerCandidates.map((el) => JSON.parse(el)),
      offerCandidates: roomOffer.offerCandidates.map((el) => JSON.parse(el)),
    });
  }

  @SubscribeMessage('client:answercandidate')
  async saveOfferCandidate(
    @MessageBody()
    data: { id: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomOffersModel.findOne({ roomId: data.id }).updateOne({
      $addToSet: { answerCandidates: JSON.stringify(data.candidate) },
    });
    const roomOffer = await this.roomOffersModel.findOne({ roomId: data.id });

    client.emit(`room:${data.id}:candidates`, {
      answerCandidates: roomOffer.answerCandidates.map((el) => JSON.parse(el)),
      offerCandidates: roomOffer.offerCandidates.map((el) => JSON.parse(el)),
    });
  }

  // await this.roomOffersModel
  //   .findOne({ roomId: data.id })
  //   .updateOne({ $addToSet: { answerCandidates: data.candidate } });
}
