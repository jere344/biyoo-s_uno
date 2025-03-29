import { AxiosResponse } from "axios";
import CustomAxios from "./CustomAxios";
import IRobloxAvatar from "@DI/IRobloxAvatar";

// In-memory cache to avoid unnecessary API calls
const avatarCache: Record<string, IRobloxAvatar> = {};

/**
 * Fetches avatar model data for a specific player.
 * Uses in-memory caching to avoid redundant API calls.
 */
const getAvatarModel = async (playerName: string): Promise<IRobloxAvatar> => {
  // Check cache first
  if (avatarCache[playerName]) {
    console.log(`Using cached avatar for player: ${playerName}`);
    return Promise.resolve(avatarCache[playerName]);
  }

  // If not in cache, fetch from API
  const response: AxiosResponse<IRobloxAvatar> = await CustomAxios.get(`avatar/${playerName}/model/`);
  
  // Store in cache
  avatarCache[playerName] = response.data;
  
  return response.data;
};

/**
 * Constructs the full URL for a specific avatar file
 */
const getAvatarFileUrl = (playerName: string, fileName: string): string => {
  return `${import.meta.env.VITE_API_URL}avatar/${playerName}/file/${fileName}`;
};

/**
 * Clears the cache for a specific player or all players if no name is provided
 */
const clearCache = (playerName?: string): void => {
  if (playerName) {
    delete avatarCache[playerName];
  } else {
    Object.keys(avatarCache).forEach(key => delete avatarCache[key]);
  }
};

const RobloxAvatarDS = {
  getAvatarModel,
  getAvatarFileUrl,
  clearCache
};

export default RobloxAvatarDS;
