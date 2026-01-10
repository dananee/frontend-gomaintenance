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
import { toast } from "sonner";
import type { MotorcycleRow } from "@/features/vehicles/schemas/motorcycleImportSchema";

export function MotorcyclesPage() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

            {/* Import Modal - Now handles import internally */}
            <ImportMotorcyclesModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
            />
        </div>
    );
}

/**
 * Alternative: Using with React Query for better state management
 */
import { useQueryClient } from "@tanstack/react-query";

export function MotorcyclesPageWithReactQuery() {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Modal handles import internally, just invalidate queries on success
    const handleImportSuccess = () => {
        // Invalidate and refetch motorcycles list
        queryClient.invalidateQueries({ queryKey: ["motorcycles"] });
        toast.success("Motorcycles imported successfully");
    };

    return (
        <div className="container mx-auto p-6">
            <Button onClick={() => setIsImportModalOpen(true)}>
                Import Motorcycles
            </Button>

            <ImportMotorcyclesModal
                open={isImportModalOpen}
                onOpenChange={(open) => {
                    setIsImportModalOpen(open);
                    if (!open) {
                        // Refresh data when modal closes
                        handleImportSuccess();
                    }
                }}
            />
        </div>
    );
}
