import { z } from "zod";

/**
 * Energy Type Enum - matches backend database enum
 */
export const EnergyTypeEnum = z.enum(["PETROL", "ELECTRIC"]);

export type EnergyType = z.infer<typeof EnergyTypeEnum>;

/**
 * Motorcycle Import Schema
 * Validates motorcycle data before submission to backend
 */
export const motorcycleImportSchema = z.object({
  // Required fields
  immatriculation: z
    .string()
    .min(1, "License plate (Immatriculation) is required")
    .max(50, "License plate must be less than 50 characters"),
  
  marque: z
    .string()
    .min(1, "Brand (Marque) is required")
    .max(100, "Brand must be less than 100 characters"),
  
  modele: z
    .string()
    .max(100, "Model must be less than 100 characters")
    .optional(),
  
  energy_type: EnergyTypeEnum,
  
  // Optional fields
  insurance_policy: z.string().max(100).optional(),
  
  address: z.string().max(255).optional(),
  
  vin: z.string().max(50).optional(),
  
  release_date: z.string().optional(),
  
  driver_name: z.string().max(100).optional(),
  
  age: z.number().optional(),
  
  // Hardcoded values (automatically injected)
  type: z.literal("MOTORCYCLE"),
  
  maintenance_plan_id: z.null(),
  
  current_mileage: z.number().default(0),
});

export type MotorcycleRow = z.infer<typeof motorcycleImportSchema>;

/**
 * Batch validation for multiple motorcycles
 */
export const validateMotorcycleBatch = (motorcycles: unknown[]) => {
  const results = motorcycles.map((motorcycle, index) => {
    const validation = motorcycleImportSchema.safeParse(motorcycle);
    
    if (!validation.success) {
      return {
        row: index + 1,
        success: false,
        errors: validation.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }
    
    return {
      row: index + 1,
      success: true,
      data: validation.data,
    };
  });
  
  return results;
};
