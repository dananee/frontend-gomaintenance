import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBranding, updateBranding, uploadLogo, BrandingSettings, UpdateBrandingRequest } from "@/services/settings/brandingService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useBranding = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();

    const { data: branding, isLoading, error } = useQuery({
        queryKey: ["branding"],
        queryFn: getBranding,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateBrandingRequest) => updateBranding(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branding"] });
            toast.success(t("success.brandingUpdated"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.brandingUpdateFailed"));
        },
    });

    const uploadLogoMutation = useMutation({
        mutationFn: (file: File) => uploadLogo(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branding"] });
            toast.success(t("success.logoUploaded"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.logoUploadFailed"));
        },
    });

    return {
        branding,
        isLoading,
        error,
        updateBranding: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        uploadLogo: uploadLogoMutation.mutateAsync,
        isUploading: uploadLogoMutation.isPending,
    };
};
