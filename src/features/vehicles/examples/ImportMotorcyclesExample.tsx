/**
 * Example Usage of ImportMotorcyclesModal Component
 * 
 * This file demonstrates how to integrate the ImportMotorcyclesModal
 * into your application with backend API integration.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImportMotorcyclesModal } from "@/features/vehicles/components/ImportMotorcyclesModal";
import { apiClient } from "@/lib/api/axiosClient";
import { useToast } from "@/components/ui/use-toast";
import type { MotorcycleRow } from "@/features/vehicles/schemas/motorcycleImportSchema";

export function MotorcyclesPage() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { toast } = useToast();

    /**
     * Handle motorcycle import
     * Sends the validated motorcycle data to the backend API
     */
    const handleImportMotorcycles = async (motorcycles: MotorcycleRow[]) => {
        try {
            // Send to backend API endpoint
            const response = await apiClient.post("/vehicles/motorcycles/import", {
                motorcycles,
            });

            // Show success toast
            if (response.data.success_count > 0) {
                toast({
                    title: "Import Successful",
                    description: `${response.data.success_count} motorcycles imported successfully`,
                });
            }

            // Return result for modal to display
            return {
                success: response.data.success_count || 0,
                failed: response.data.failed_count || 0,
                errors: response.data.errors || [],
            };
        } catch (error: any) {
            // Handle API errors
            console.error("Import failed:", error);

            toast({
                title: "Import Failed",
                description: error.response?.data?.message || "Failed to import motorcycles",
                variant: "destructive",
            });

            return {
                success: 0,
                failed: motorcycles.length,
                errors: [
                    {
                        row: 0,
                        message: error.response?.data?.message || "Server error occurred",
                    },
                ],
            };
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Motorcycles</h1>

                <Button
                    onClick={() => setIsImportModalOpen(true)}
                    className="bg-[#165FF2] hover:bg-[#1450d0]"
                >
                    Import Motorcycles
                </Button>
            </div>

            {/* Your motorcycles table/list here */}

            {/* Import Modal */}
            <ImportMotorcyclesModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                onImport={handleImportMotorcycles}
            />
        </div>
    );
}

/**
 * Alternative: Using with React Query for better state management
 */
export function MotorcyclesPageWithReactQuery() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const importMutation = useMutation({
        mutationFn: async (motorcycles: MotorcycleRow[]) => {
            const response = await apiClient.post("/vehicles/motorcycles/import", {
                motorcycles,
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch motorcycles list
            queryClient.invalidateQueries({ queryKey: ["motorcycles"] });

            if (data.success_count > 0) {
                toast({
                    title: "Import Successful",
                    description: `${data.success_count} motorcycles imported`,
                });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Import Failed",
                description: error.response?.data?.message || "Failed to import",
                variant: "destructive",
            });
        },
    });

    const handleImportMotorcycles = async (motorcycles: MotorcycleRow[]) => {
        try {
            const result = await importMutation.mutateAsync(motorcycles);
            return {
                success: result.success_count || 0,
                failed: result.failed_count || 0,
                errors: result.errors || [],
            };
        } catch (error) {
            return {
                success: 0,
                failed: motorcycles.length,
                errors: [{ row: 0, message: "Import failed" }],
            };
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Button onClick={() => setIsImportModalOpen(true)}>
                Import Motorcycles
            </Button>

            <ImportMotorcyclesModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                onImport={handleImportMotorcycles}
            />
        </div>
    );
}
