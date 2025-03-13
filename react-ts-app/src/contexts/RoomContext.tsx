import React, { useState, ReactNode } from 'react';
import { RoomContext } from './RoomContextStore';

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
