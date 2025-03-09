import React, { createContext, useState, useContext, ReactNode } from 'react';

interface RoomContextType {
  currentRoomId: string | null;
  setCurrentRoomId: (roomId: string | null) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('currentRoomId');
  });

  const joinRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    localStorage.setItem('currentRoomId', roomId);
  };

  const leaveRoom = () => {
    setCurrentRoomId(null);
    localStorage.removeItem('currentRoomId');
  };

  return (
    <RoomContext.Provider value={{ currentRoomId, setCurrentRoomId, joinRoom, leaveRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
