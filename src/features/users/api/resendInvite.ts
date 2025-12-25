import apiClient from "@/lib/api/axiosClient";

export async function resendInvite(userId: string) {
  const response = await apiClient.post(`/users/${userId}/resend-invite`);
  return response.data;
}
