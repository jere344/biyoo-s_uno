import { AxiosResponse } from "axios";
import CustomAxios from "./CustomAxios";
import { IPublicUser } from "../data_interfaces/IUser";

interface LeaderboardParams {
  sort_by?: 'games_won' | 'games_played'; 
  limit?: number;
}

const getLeaderboard = (params: LeaderboardParams = {}): Promise<AxiosResponse<IPublicUser[]>> => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return CustomAxios.get(`leaderboard/${queryString}`);
};

const LeaderboardDS = {
  getLeaderboard,
};

export default LeaderboardDS;

