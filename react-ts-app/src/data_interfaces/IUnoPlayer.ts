import IUnoCard from "./IUnoCard";
import { IUser } from "./IUser";
import IGameEnvironment from "./IGameEnvironment";

export default interface IUnoPlayer {
    id: number;
    user: IUser;
    hand: IUnoCard[] | number;
    score?: number;
    player_number: string;
    card_back: IUnoCard;
    said_uno: boolean;
    game_environment: IGameEnvironment;
}