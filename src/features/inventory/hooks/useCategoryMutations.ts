import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartCategory, CreatePartCategoryRequest } from "../api/createPartCategory";
import { toast } from "sonner";

export function useCreatePartCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePartCategoryRequest) => createPartCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["part-categories"] });
            toast.success("Category created", {
                description: "New category has been added.",
            });
        },
        onError: (error: any) => {
            toast.error("Failed to create category", {
                description: error?.response?.data?.error || "An error occurred while creating the category.",
            });
        },
    });
}
