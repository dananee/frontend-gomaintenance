import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, uploadAvatar, ProfileData, UpdateProfileRequest } from "@/services/settings/profileService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useProfile = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success(t("success.profileUpdated"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.profileUpdateFailed"));
        },
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: (file: File) => uploadAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success(t("success.avatarUploaded"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.avatarUploadFailed"));
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
