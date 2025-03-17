// src/interfaces/IMessage.ts
import { IUser } from "./IUser";

export default interface IMessage {
  id: number;
  room_id: number;
  sender: IUser;
  content: string;
  created_at: string;
}
