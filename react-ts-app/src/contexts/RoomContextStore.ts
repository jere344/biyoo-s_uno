import { createContext } from 'react';

export interface IRoomContextType {
    currentRoomId: string | null;
    setCurrentRoomId: (roomId: string | null) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
  }
  

export const RoomContext = createContext<IRoomContextType | undefined>(undefined);
