import UnoCard from './IUnoCard';
import UnoPlayer from './IUnoPlayer';

export default interface UnoGame {
    id?: number;
    players: UnoPlayer[];
    current_player_number: string;
    current_card: UnoCard;
    pile: UnoCard[] | int;
    direction: string;
    winner?: string | null;
    card_back: UnoCard;
    game_over?: boolean;
}