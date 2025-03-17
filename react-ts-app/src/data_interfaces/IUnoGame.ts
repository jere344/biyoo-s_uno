import IUnoCard from './IUnoCard';
import IUnoPlayer from './IUnoPlayer';

export default interface IUnoGame {
    id?: number;
    players: IUnoPlayer[];
    current_player_number: string;
    current_card: IUnoCard;
    pile: IUnoCard[] | number;
    direction: boolean;
    winner?: IUnoPlayer;
    card_back: IUnoCard;
    game_over?: boolean;
}