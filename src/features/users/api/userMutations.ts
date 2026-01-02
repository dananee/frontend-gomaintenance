import axios from "axios";
import { UserSkill, UserCertification, UserNote } from "../types/user.types";

export const addUserNote = async (userId: string, data: { content: string }): Promise<UserNote> => {
  const response = await axios.post(`/users/${userId}/notes`, data);
  return response.data;
};

export const addUserSkill = async (userId: string, data: Partial<UserSkill>): Promise<UserSkill> => {
  const response = await axios.post(`/users/${userId}/skills`, data);
  return response.data;
};

export const addUserCertification = async (userId: string, data: Partial<UserCertification>): Promise<UserCertification> => {
  const response = await axios.post(`/users/${userId}/certifications`, data);
  return response.data;
};

export const deleteUserAttachment = async (attachmentId: string): Promise<void> => {
  await axios.delete(`/attachments/${attachmentId}`);
};

// Work orders fetcher can go here or in work order feature
export const getUserWorkOrders = async (userId: string) => {
    const response = await axios.get(`/users/${userId}/work-orders`);
    return response.data;
};
