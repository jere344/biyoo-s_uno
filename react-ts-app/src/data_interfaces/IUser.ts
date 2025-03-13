export default interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    profile_picture?: File | null;
    is_online: boolean;
    cards_currency: number;
    game_played: number;
    game_won: number;
}
