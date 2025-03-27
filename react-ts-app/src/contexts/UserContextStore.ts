import { createContext } from 'react';
import { IUser } from '@DI/IUser';

interface UserContextType {
    user: IUser | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);