export interface PartCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Part {
  id: string;
  name: string;
  part_number: string;
  sku: string;
  description?: string;
  category_id?: string;
  category?: PartCategory;
  total_quantity: number;
  min_quantity: number;
  unit: string;
  default_location: string;
  supplier_id?: string;
  supplier?: Supplier;
  brand?: string;
  unit_price_ht: number; // Unit price without tax
  vat_rate: number;     // VAT Rate percentage (e.g., 20)
  is_critical: boolean;
  created_at?: string;
  updated_at?: string;
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

export type MovementType = 'PURCHASE' | 'CONSUMPTION' | 'TRANSFER' | 'RETURN' | 'ADJUSTMENT' | 'SCRAP' | 'ADJUSTMENT_IN' | 'TRANSFER_IN';

export interface StockMovement {
  id: string;
  part_id: string;
  warehouse_id?: string;
  to_warehouse_id?: string;
  movement_type: MovementType;
  quantity: number;
  snapshot_quantity: number;
  unit_price_ht: number;
  vat_rate: number;
  total_price_ttc: number;
  reason?: string;
  reference_type?: string;
  reference_no?: string;
  notes?: string;
  supplier_id?: string;
  work_order_id?: string;
  created_at: string;
  created_by: string;
  part?: Part;
  warehouse?: { name: string };
  to_warehouse?: { name: string };
  supplier?: Supplier;
  created_user?: { first_name: string, last_name: string };
}

export interface InventoryAudit {
  id: string;
  warehouse_id: string;
  warehouse?: { name: string };
  name: string;
  description?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'VALIDATED' | 'CANCELLED';
  scope_type: 'ALL' | 'IN_STOCK_ONLY' | 'CATEGORY';
  scope_category_id?: string;
  created_by: string;
  created_user?: { first_name: string, last_name: string };
  validated_by?: string;
  validated_at?: string;
  created_at: string;
  updated_at: string;
  lines?: InventoryAuditLine[];
}

export interface InventoryAuditLine {
  id: string;
  audit_id: string;
  part_id: string;
  part?: Part;
  sku_snapshot: string;
  name_snapshot: string;
  system_qty_snapshot: number;
  physical_qty: number | null;
  difference: number;
  reason_code?: string;
  notes?: string;
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
  warehouse_id?: string;
  to_warehouse_id?: string;
  movement_type: MovementType;
  quantity: number;
  unit_price_ht?: number;
  vat_rate?: number;
  reason?: string;
  work_order_id?: string;
}

export interface StockBatch {
  id: string;
  tenant_id: string;
  part_id: string;
  warehouse_id: string;
  source_movement_id: string;
  received_at: string;
  initial_qty: number;
  remaining_qty: number;
  unit_cost_ht: number;
  vat_rate: number;
  currency: string;
  status: 'OPEN' | 'CLOSED';
}

export interface ReceiveStockRequest {
  part_id: string;
  warehouse_id: string;
  quantity: number;
  unit_cost_ht: number;
  vat_rate: number;
  received_at?: string;
  supplier_id?: string;
  reference_type?: string;
  reference_no?: string;
  notes?: string;
  movement_type?: string;
}

export interface UpdatePartRequest {
  part_number?: string;
  sku?: string;
  name?: string;
  description?: string;
  category_id?: string;
  brand?: string;
  unit_price_ht?: number;
  vat_rate?: number;
  is_critical?: boolean;
  min_quantity?: number;
  unit?: string;
  default_location?: string;
  supplier_id?: string;
}
