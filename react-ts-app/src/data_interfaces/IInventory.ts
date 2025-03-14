import ICardBack from './ICardBack';

export default interface IInventory {
  id: number;
  card_back: ICardBack;
  is_active: boolean;
}
