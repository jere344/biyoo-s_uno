import { AxiosResponse } from "axios";
import CustomAxios from "./CustomAxios";
import ICardBack from "../data_interfaces/ICardBack";
import IInventory from "../data_interfaces/IInventory";

const getCardBacks = (): Promise<AxiosResponse<ICardBack[]>> => (
  CustomAxios.get("shop/card_backs/")
);

const getInventory = (): Promise<AxiosResponse<IInventory[]>> => (
  CustomAxios.get("shop/inventory/")
);

const purchaseCardBack = (cardBackId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/card_backs/purchase/${cardBackId}/`)
);

const activateCardBack = (inventoryId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/inventory/activate/${inventoryId}/`)
);

const ShopDS = {
  getCardBacks,
  getInventory,
  purchaseCardBack,
  activateCardBack,
};

export default ShopDS;
