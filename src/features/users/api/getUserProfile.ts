import { apiClient as axios } from "@/lib/api/axiosClient";
import { UserProfile } from "../types/user.types";

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(`/users/${userId}/full-profile`);
  return response.data;
};
