import { createContext } from 'react';
import { IUser } from '../models/IUser';

interface UserContextType {
    user: IUser | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);