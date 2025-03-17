import { AxiosResponse } from "axios";
import CustomAxios from "./CustomAxios";
import ICardBack from "../data_interfaces/ICardBack";
import ICardBackInventory from "../data_interfaces/ICardBackInventory";
import IProfileEffect from "../data_interfaces/IProfileEffect";
import IProfileEffectInventory from "../data_interfaces/IProfileEffectInventory";
import IGameEnvironment from "../data_interfaces/IGameEnvironment";
import IGameEnvironmentInventory from "../data_interfaces/IGameEnvironmentInventory";

const getCardBacks = (): Promise<AxiosResponse<ICardBack[]>> => (
  CustomAxios.get("shop/card_backs/")
);

const getCardBackInventory = (): Promise<AxiosResponse<ICardBackInventory[]>> => (
  CustomAxios.get("shop/card_backs/inventory/")
);

const purchaseCardBack = (cardBackId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/card_backs/purchase/${cardBackId}/`)
);

const activateCardBack = (inventoryId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/card_backs/inventory/activate/${inventoryId}/`)
);

const getProfileEffects = (): Promise<AxiosResponse<IProfileEffect[]>> => (
  CustomAxios.get("shop/profile_effects/")
);

const getProfileEffectInventory = (): Promise<AxiosResponse<IProfileEffectInventory[]>> => (
  CustomAxios.get("shop/profile_effects/inventory/")
);

const purchaseProfileEffect = (profileEffectId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/profile_effects/purchase/${profileEffectId}/`)
);

const activateProfileEffect = (inventoryId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/profile_effects/inventory/activate/${inventoryId}/`)
);

const getGameEnvironments = (): Promise<AxiosResponse<IGameEnvironment[]>> => (
  CustomAxios.get("shop/game_environments/")
);

const getGameEnvironmentInventory = (): Promise<AxiosResponse<IGameEnvironmentInventory[]>> => (
  CustomAxios.get("shop/game_environments/inventory/")
);

const purchaseGameEnvironment = (gameEnvironmentId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/game_environments/purchase/${gameEnvironmentId}/`)
);

const activateGameEnvironment = (inventoryId: number): Promise<AxiosResponse> => (
  CustomAxios.post(`shop/game_environments/inventory/activate/${inventoryId}/`)
);

const ShopDS = {
  getCardBacks,
  getCardBackInventory,
  purchaseCardBack,
  activateCardBack,
  getProfileEffects,
  getProfileEffectInventory,
  purchaseProfileEffect,
  activateProfileEffect,
  getGameEnvironments,
  getGameEnvironmentInventory,
  purchaseGameEnvironment,
  activateGameEnvironment,
};

export default ShopDS;
