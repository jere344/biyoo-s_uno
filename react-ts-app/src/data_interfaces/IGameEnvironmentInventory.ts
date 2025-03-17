import IGameEnvironment from './IGameEnvironment';

export default interface IGameEnvironmentInventory {
  id: number;
  game_environment: IGameEnvironment;
  is_active: boolean;
}
