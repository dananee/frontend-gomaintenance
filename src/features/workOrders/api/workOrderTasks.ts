import apiClient from "@/lib/api/axiosClient";

export interface WorkOrderTask {
  id: string;
  work_order_id: string;
  name: string;
  description?: string;
  is_done: boolean;
  due_date?: string;
  assignee_id?: string;
  assignee?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateWorkOrderTaskRequest {
  name: string;
  description?: string;
  due_date?: string;
  assignee_id?: string;
}

export interface UpdateWorkOrderTaskRequest {
  name?: string;
  description?: string;
  is_done?: boolean;
  due_date?: string;
  assignee_id?: string;
}

// List all tasks for a work order
export const listWorkOrderTasks = async (workOrderId: string): Promise<WorkOrderTask[]> => {
  const response = await apiClient.get<WorkOrderTask[]>(`/work-orders/${workOrderId}/tasks`);
  return response.data;
};

// Create a new task for a work order
export const createWorkOrderTask = async (
  workOrderId: string,
  data: CreateWorkOrderTaskRequest
): Promise<WorkOrderTask> => {
  const response = await apiClient.post<WorkOrderTask>(`/work-orders/${workOrderId}/tasks`, data);
  return response.data;
};

// Update a task
export const updateWorkOrderTask = async (
  workOrderId: string,
  taskId: string,
  data: UpdateWorkOrderTaskRequest
): Promise<WorkOrderTask> => {
  const response = await apiClient.patch<WorkOrderTask>(
    `/work-orders/${workOrderId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

// Delete a task
export const deleteWorkOrderTask = async (workOrderId: string, taskId: string): Promise<void> => {
  await apiClient.delete(`/work-orders/${workOrderId}/tasks/${taskId}`);
};
