export interface IUser {
    id: number;
    email?: string;
    username: string;
    profile_picture?: string | undefined;
    is_online: boolean;
    cards_currency: number;
    games_played: number;
    games_won: number;
    room_id: number;
    profile_effect: string;
    roblox_username?: string | undefined;
}

export interface IPublicUser {
    id: number;
    username: string;
    profile_picture?: string | undefined;
    games_played: number;
    games_won: number;
    profile_effect: string;
    roblox_username?: string | undefined;
}