import { z } from "zod";

export const partSchema = z.object({
    name: z.string().min(1, "Required"),
    part_number: z.string(),
    sku: z.string(),
    brand: z.string(),
    unit: z.string(),
    unit_price_ht: z.number().min(0),
    vat_rate: z.number().min(0),
    min_quantity: z.number().min(0),
    default_location: z.string(),
    is_critical: z.boolean(),
    category_id: z.string(),
    supplier_id: z.string(),
    description: z.string(),
});

export type PartFormValues = z.infer<typeof partSchema>;
