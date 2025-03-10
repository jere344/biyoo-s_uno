import UnoCard from "./IUnoCard";

export default interface UnoPlayer {
    user: string;
    hand: UnoCard[] | int;
    score?: number;
    player_number: string;
    card_back: UnoCard;
}