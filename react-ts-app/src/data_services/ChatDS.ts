// src/data_services/ChatDS.ts
import { AxiosResponse } from "axios";
import CustomAxios from "./CustomAxios";
import IMessage from "../interfaces/IMessage";

const getMessages = (roomId: number): Promise<AxiosResponse<IMessage[]>> => CustomAxios.get(`rooms/${roomId}/chat/`);

const sendMessage = (roomId: number, message: Partial<IMessage>): Promise<AxiosResponse<IMessage>> =>
    CustomAxios.post(`rooms/${roomId}/chat/`, message);

const deleteMessage = (roomId: number, messageId: number): Promise<void> =>
    CustomAxios.delete(`rooms/${roomId}/chat/${messageId}/`);

const ChatDS = {
    getMessages,
    sendMessage,
    deleteMessage,
};

export default ChatDS;
