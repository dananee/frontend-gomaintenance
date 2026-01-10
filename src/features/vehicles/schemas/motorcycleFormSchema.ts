import { z } from "zod";

/**
 * Zod schema for motorcycle form validation
 * All labels and error messages in French
 */
export const motorcycleFormSchema = z.object({
  plate_number: z
    .string()
    .min(1, "Immatriculation requise")
    .max(50, "L'immatriculation doit faire moins de 50 caractères"),
  
  brand: z
    .string()
    .min(1, "Marque requise")
    .max(100, "La marque doit faire moins de 100 caractères"),
  
  model: z
    .string()
    .min(1, "Modèle requis")
    .max(100, "Le modèle doit faire moins de 100 caractères"),
  
  energy_type: z.enum(["PETROL", "ELECTRIC"]),
  
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
});

export type MotorcycleFormData = z.infer<typeof motorcycleFormSchema>;
