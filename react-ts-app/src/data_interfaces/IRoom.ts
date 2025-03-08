import IUser from './IUser'

export default interface IRoom {
  id: number
  name: string
  users: IUser[]
  created_at: string
  player_limit: number,
  is_open: boolean
}