export interface IRoomContextType {
    currentRoomId: string | null;
    setCurrentRoomId: (roomId: string | null) => void;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
  }
  