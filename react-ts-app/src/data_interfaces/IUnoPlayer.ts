import UnoCard from "./IUnoCard";
import IUser from "./IUser";

export default interface UnoPlayer {
    user: IUser;
    hand: UnoCard[] | int;
    score?: number;
    player_number: string;
    card_back: UnoCard;
    said_uno: boolean;
}