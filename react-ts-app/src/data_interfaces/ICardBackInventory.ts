import ICardBack from './ICardBack';

export default interface ICardBackInventory {
  id: number;
  card_back: ICardBack;
  is_active: boolean;
}
