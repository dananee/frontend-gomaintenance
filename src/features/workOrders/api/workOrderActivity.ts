import apiClient from "@/lib/api/axiosClient";

export interface ActivityLog {
  id: string;
  tenant_id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: string; // JSON string
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// List activity logs for a specific work order
export const listWorkOrderActivity = async (
  workOrderId: string,
  page = 1,
  pageSize = 50
): Promise<ActivityLogResponse> => {
  const response = await apiClient.get<ActivityLogResponse>("/activity-logs", {
    params: {
      entity_type: "work_order",
      entity_id: workOrderId,
      page,
      page_size: pageSize,
    },
  });
  return response.data;
};
