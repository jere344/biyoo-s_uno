import { createContext } from 'react';
import { IRoomContextType } from '../data_interfaces/IRoomContextType';

// Export the context so it can be imported elsewhere
export const RoomContext = createContext<IRoomContextType | undefined>(undefined);
