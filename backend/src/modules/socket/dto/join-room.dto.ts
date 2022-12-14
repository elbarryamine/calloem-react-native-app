import { Types } from 'mongoose';

export class JoinRoomDto {
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  localDescription: {
    type: string | null;
    sdp: string;
  };
}
