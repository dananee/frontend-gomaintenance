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
  warehouse_id: string | null; // Nullable
  warehouse?: { name: string };
  movement_type: "in" | "out" | "adjustment"; // Matches backend
  quantity: number;
  reason?: string;
  work_order_id?: string;
  created_at: string;
}

export interface PartDocument {
  id: string;
  part_id: string;
  name: string;
  file_size: number;
  file_url: string;
  media_type: string;
  created_at: string;
}

export interface PartComment {
  id: string;
  part_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}


export interface InventoryStock {
  id: string;
  warehouse_id: string | null;
  part_id: string;
  quantity: number;
  min_quantity: number;
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface CreateStockMovementRequest {
  part_id: string;
  warehouse_id?: string; // Optional
  movement_type: "in" | "out" | "adjustment";
  quantity: number;
  reason?: string;
  work_order_id?: string;
}

export interface UpdatePartRequest {
  part_number: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  unit_price?: number;
  quantity?: number;
  min_quantity?: number;
  location?: string;
  supplier_id?: string;
}
