"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MotorcycleForm } from "./MotorcycleForm";
import { useCreateMotorcycle } from "../hooks/useCreateMotorcycle";
import { useUpdateMotorcycle } from "../hooks/useUpdateMotorcycle";
import type { Motorcycle } from "../types/motorcycle.types";
import type { MotorcycleFormData } from "../schemas/motorcycleFormSchema";

interface CreateMotorcycleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Motorcycle;
    onSuccess?: () => void;
}

export function CreateMotorcycleModal({
    open,
    onOpenChange,
    initialData,
    onSuccess,
}: CreateMotorcycleModalProps) {
    const { mutate: createMotorcycle, isPending: isCreating } = useCreateMotorcycle();
    const { mutate: updateMotorcycle, isPending: isUpdating } = useUpdateMotorcycle();

    const isPending = isCreating || isUpdating;

    const handleSubmit = (data: MotorcycleFormData) => {
        if (initialData) {
            updateMotorcycle(
                { id: initialData.id, ...data },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        onSuccess?.();
                    },
                }
            );
        } else {
            createMotorcycle(data, {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                },
            });
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Modifier la moto" : "Créer une nouvelle moto"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Modifiez les informations de la moto"
                            : "Ajoutez une nouvelle moto à votre flotte"}
                    </DialogDescription>
                </DialogHeader>

                <MotorcycleForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onSuccess={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
