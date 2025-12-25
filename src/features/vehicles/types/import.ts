// Types for vehicle Excel import/export

export interface ImportError {
  row: number;
  field?: string;
  message: string;
}

export interface ImportResult {
  success_count: number;
  failed_count: number;
  errors: ImportError[];
}
