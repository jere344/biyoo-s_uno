import { useContext } from 'react';
import { RoomContext } from '../contexts/RoomContextStore';
import { IRoomContextType } from '../data_interfaces/IRoomContextType';

export const useRoom = (): IRoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
