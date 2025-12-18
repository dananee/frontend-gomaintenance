import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompany, updateCompany, CompanyData, UpdateCompanyRequest } from "@/services/settings/companyService";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useCompany = () => {
    const t = useTranslations("toasts");
    const queryClient = useQueryClient();

    const { data: company, isLoading, error } = useQuery({
        queryKey: ["company"],
        queryFn: getCompany,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateCompanyRequest) => updateCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
            toast.success(t("success.companyUpdated"));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || t("error.companyUpdateFailed"));
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
