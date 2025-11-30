import apiClient from "@/lib/api/axiosClient";

export interface ActivityLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface GetActivityLogsParams {
  page?: number;
  page_size?: number;
  user_id?: string;
  entity_type?: string;
  entity_id?: string;
  from?: string;
  to?: string;
}

export interface GetActivityLogsResponse {
  data: ActivityLog[];
  page: number;
  page_size: number;
  total: number;
}

export const getActivityLogs = async (
  params: GetActivityLogsParams = {}
): Promise<GetActivityLogsResponse> => {
  const response = await apiClient.get<GetActivityLogsResponse>("/activity-logs", { params });
  return response.data;
};
