export interface IUser {
    first_name: string;
    last_name: string;
    email?: string;
    username: string;
    profile_picture?: File | null;
    is_online: boolean;
    cards_currency: number;
    games_played: number;
    games_won: number;
    room_id: number;
}

export interface IPublicUser {
    id: number;
    username: string;
    profile_picture?: File | null;
    games_played: number;
    games_won: number;
}