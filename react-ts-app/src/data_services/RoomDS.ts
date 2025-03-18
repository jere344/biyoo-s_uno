import { AxiosResponse } from "axios"
import CustomAxios from "./CustomAxios"

import IRoom from "../data_interfaces/IRoom"

const get = (): Promise<AxiosResponse<IRoom[]>> => (
  CustomAxios.get("rooms/")
)

const getOne = (id: number): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.get(`rooms/${id}/`)
)

const create = (room: IRoom): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.post("rooms/", room)
)

const update = (id: number, room: Partial<IRoom>): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.put(`rooms/${id}/`, room)
)

const join = (id: number): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.post(`rooms/${id}/join/`)
)

const joinWithCode = (id: number, code: string): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.post(`rooms/${id}/join/`, { code })
)

const leave = (room_id: number): Promise<AxiosResponse<IRoom>> => (
  CustomAxios.post(`rooms/${room_id}/leave/`)
)

const RoomDS = {
    get,
    getOne,
    create,
    update,
    join,
    joinWithCode,
    leave,
}
  
export default RoomDS;
