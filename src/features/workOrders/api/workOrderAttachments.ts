import apiClient from "@/lib/api/axiosClient";

export interface WorkOrderAttachment {
  id: string;
  work_order_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export interface AddWorkOrderAttachmentRequest {
  file_name: string;
  file_url: string;
  file_type: string;
}

// List all attachments for a work order
export const listWorkOrderAttachments = async (
  workOrderId: string
): Promise<WorkOrderAttachment[]> => {
  const response = await apiClient.get<WorkOrderAttachment[]>(
    `/work-orders/${workOrderId}/attachments`
  );
  return response.data;
};

// Add an attachment to a work order
export const addWorkOrderAttachment = async (
  workOrderId: string,
  data: AddWorkOrderAttachmentRequest
): Promise<WorkOrderAttachment> => {
  const response = await apiClient.post<WorkOrderAttachment>(
    `/work-orders/${workOrderId}/attachments`,
    data
  );
  return response.data;
};

// Delete an attachment
export const deleteWorkOrderAttachment = async (
  workOrderId: string,
  attachmentId: string
): Promise<void> => {
  await apiClient.delete(`/work-orders/${workOrderId}/attachments/${attachmentId}`);
};
