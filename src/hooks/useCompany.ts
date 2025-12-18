import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompany, updateCompany, CompanyData, UpdateCompanyRequest } from "@/services/settings/companyService";
import { toast } from "sonner";

export const useCompany = () => {
    const queryClient = useQueryClient();

    const { data: company, isLoading, error } = useQuery({
        queryKey: ["company"],
        queryFn: getCompany,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateCompanyRequest) => updateCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success("Company settings updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update company settings");
        },
    });

    return {
        company,
        isLoading,
        error,
        updateCompany: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
};
