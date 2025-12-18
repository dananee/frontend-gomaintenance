import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, uploadAvatar, ProfileData, UpdateProfileRequest } from "@/services/settings/profileService";
import { toast } from "sonner";

export const useProfile = () => {
    const queryClient = useQueryClient();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update profile");
        },
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => uploadAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Avatar uploaded successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to upload avatar");
        },
    });

    return {
        profile,
        isLoading,
        error,
        updateProfile: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        isUploading: uploadAvatarMutation.isPending,
    };
};
