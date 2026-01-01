import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserNote, addUserSkill, addUserCertification, deleteUserAttachment } from "../api/userMutations";

export function useAddUserNote(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string }) => addUserNote(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    },
  });
}

export function useAddUserSkill(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => addUserSkill(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    },
  });
}

export function useAddUserCertification(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => addUserCertification(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    },
  });
}

export function useDeleteUserAttachment(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: string) => deleteUserAttachment(attachmentId),
    onSuccess: () => {
        // userId needed for invalidation
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    },
  });
}
