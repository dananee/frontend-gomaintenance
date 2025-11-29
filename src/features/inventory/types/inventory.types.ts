export interface Part {
  id: string;
  name: string;
  part_number: string;
  description?: string;
  category?: string;
  quantity: number;
  min_quantity: number;
  cost: number;
  location: string;
  supplier?: string;
  supplier_id?: string;
  warehouse?: string;
  compatible_vehicles?: string[];
  created_at?: string;
  updated_at?: string;
  brand?: string;
  unit_price?: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StockAdjustment {
  id: string;
  part_id: string;
  adjustment_type: "add" | "remove" | "set";
  quantity: number;
  reason: string;
  notes?: string;
  adjusted_by: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  part_id: string;
  type: "in" | "out" | "transfer";
  quantity: number;
  from_location?: string;
  to_location?: string;
  reference?: string;
  notes?: string;
  created_at: string;
}
