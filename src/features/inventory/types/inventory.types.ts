export interface Part {
  id: string;
  name: string;
  part_number: string;
  description?: string;
  category: string;
  quantity: number;
  min_quantity: number;
  cost: number;
  location: string;
  supplier?: string;
  warehouse?: string;
  compatible_vehicles?: string[];
  created_at: string;
  updated_at: string;
}
