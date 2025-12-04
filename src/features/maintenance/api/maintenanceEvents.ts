import apiClient from "@/lib/api/axiosClient";
import { EventDetails, UpdateEventData } from "../types/maintenanceDashboard.types";

/**
 * Fetch a single event by ID with full details
 */
export const getEventById = async (id: string): Promise<EventDetails> => {
  const response = await apiClient.get<EventDetails>(`/scheduled-maintenance/${id}`);
  return response.data;
};

/**
 * Update an existing maintenance event
 */
export const updateEvent = async (
  id: string,
  data: UpdateEventData
): Promise<EventDetails> => {
  const response = await apiClient.put<EventDetails>(
    `/scheduled-maintenance/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete a maintenance event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await apiClient.delete(`/scheduled-maintenance/${id}`);
};

/**
 * Mark an event as completed
 */
export const markEventComplete = async (id: string): Promise<EventDetails> => {
  const response = await apiClient.patch<EventDetails>(
    `/scheduled-maintenance/${id}`,
    { status: "completed" }
  );
  return response.data;
};

/**
 * Convert a scheduled maintenance event to a work order
 */
export const convertToWorkOrder = async (
  id: string
): Promise<any> => {
  const response = await apiClient.post(
    `/scheduled-maintenance/${id}/convert-to-work-order`
  );
  return response.data;
};
