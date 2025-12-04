export interface MaintenanceFilters {
  assets: string[];
  categories: string[];
  technicians: string[];
  statuses: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  recurrence: string | null;
}

export interface FilterOptions {
  assets: Array<{ id: string; label: string }>;
  categories: Array<{ id: string; label: string }>;
  technicians: Array<{ id: string; label: string }>;
  statuses: Array<{ id: string; label: string }>;
  recurrenceTypes: Array<{ id: string; label: string }>;
}

export const DEFAULT_FILTERS: MaintenanceFilters = {
  assets: [],
  categories: [],
  technicians: [],
  statuses: [],
  dateRange: {
    start: null,
    end: null,
  },
  recurrence: null,
};

export const STATUS_OPTIONS = [
  { id: "scheduled", label: "Scheduled" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "overdue", label: "Overdue" },
];

export const RECURRENCE_OPTIONS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "custom", label: "Custom" },
];
