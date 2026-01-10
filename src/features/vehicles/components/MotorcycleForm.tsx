"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motorcycleFormSchema, type MotorcycleFormData } from "../schemas/motorcycleFormSchema";
import type { Motorcycle } from "../types/motorcycle.types";

interface MotorcycleFormProps {
    initialData?: Motorcycle;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: MotorcycleFormData) => void;
    isPending?: boolean;
}

export function MotorcycleForm({
    initialData,
    onSuccess,
    onCancel,
    onSubmit,
    isPending = false,
}: MotorcycleFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MotorcycleFormData>({
        resolver: zodResolver(motorcycleFormSchema),
        defaultValues: initialData
            ? {
                plate_number: initialData.plate_number,
                brand: initialData.brand,
                model: initialData.model,
                energy_type: initialData.energy_type,
                status: initialData.status,
            }
            : {
                status: "active",
            },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Immatriculation */}
            <div>
                <Input
                    label="Immatriculation"
                    placeholder="Ex: ABC-1234"
                    {...register("plate_number")}
                    error={errors.plate_number?.message}
                />
            </div>

            {/* Marque */}
            <div>
                <Input
                    label="Marque"
                    placeholder="Ex: Yamaha, Honda"
                    {...register("brand")}
                    error={errors.brand?.message}
                />
            </div>

            {/* Modèle */}
            <div>
                <Input
                    label="Modèle"
                    placeholder="Ex: MT-07"
                    {...register("model")}
                    error={errors.model?.message}
                />
            </div>

            {/* Type d'énergie */}
            <div>
                <label className="mb-2 block text-sm font-medium">Type d&apos;énergie</label>
                <select
                    {...register("energy_type")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Sélectionner...</option>
                    <option value="PETROL">Essence</option>
                    <option value="ELECTRIC">Électrique</option>
                </select>
                {errors.energy_type && (
                    <p className="text-sm text-red-500 mt-1">{errors.energy_type.message}</p>
                )}
            </div>

            {/* Statut */}
            <div>
                <label className="mb-2 block text-sm font-medium">Statut</label>
                <select
                    {...register("status")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="active">Actif</option>
                    <option value="maintenance">En maintenance</option>
                    <option value="inactive">Inactif</option>
                </select>
                {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" isLoading={isPending}>
                    {initialData ? "Mettre à jour" : "Créer"}
                </Button>
            </div>
        </form>
    );
}
