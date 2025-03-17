import { IUser } from './IUser'

export default interface IRoom {
  id: number
  name: string
  users: IUser[]
  player_limit: number,
  is_open: boolean,
  created_at: string,
}