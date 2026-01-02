import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/getUserProfile";
import { UserProfile } from "../types/user.types";

export function useUserProfile(userId: string) {
  return useQuery<UserProfile>({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserWorkOrders(userId: string) {
  return useQuery({
    queryKey: ["user-work-orders", userId],
    // We need to import getUserWorkOrders from api/userMutations or move it.
    // I put it in userMutations.ts in step 121. I'll import it.
    queryFn: async () => {
     const axios = await import("axios");

        const response = await axios.default.get(`/users/${userId}/work-orders`);
        return response.data;
    }, 
    enabled: !!userId,
  });
}
