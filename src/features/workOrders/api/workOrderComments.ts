import apiClient from "@/lib/api/axiosClient";

export interface Comment {
  id: string;
  work_order_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export interface CreateCommentDTO {
  content: string;
}

export const getWorkOrderComments = async (workOrderId: string): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/work-orders/${workOrderId}/comments`);
  return response.data;
};

export const createWorkOrderComment = async (workOrderId: string, data: CreateCommentDTO): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/work-orders/${workOrderId}/comments`, data);
  return response.data;
};

export const deleteWorkOrderComment = async (workOrderId: string, commentId: string): Promise<void> => {
  await apiClient.delete(`/work-orders/${workOrderId}/comments/${commentId}`);
};
