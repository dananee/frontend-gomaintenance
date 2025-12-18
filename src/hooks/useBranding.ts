import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBranding, updateBranding, uploadLogo, BrandingSettings, UpdateBrandingRequest } from "@/services/settings/brandingService";
import { toast } from "sonner";

export const useBranding = () => {
    const queryClient = useQueryClient();

    const { data: branding, isLoading, error } = useQuery({
        queryKey: ["branding"],
        queryFn: getBranding,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateBrandingRequest) => updateBranding(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branding"] });
            toast.success("Branding settings updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update branding settings");
        },
    });

    const uploadLogoMutation = useMutation({
        mutationFn: (file: File) => uploadLogo(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branding"] });
            toast.success("Logo uploaded successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to upload logo");
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
