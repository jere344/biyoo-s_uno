import UnoCard from "./IUnoCard";

export default interface UnoPlayer {
    user: string;
    hand: UnoCard[] | int;
    score?: number;
    placeHolder: UnoCard;
    player_number: string;
}