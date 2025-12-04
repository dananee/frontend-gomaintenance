import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MaintenanceFilters, DEFAULT_FILTERS } from "../types/maintenanceFilters.types";

interface MaintenanceFiltersStore {
  filters: MaintenanceFilters;
  setAssets: (assets: string[]) => void;
  setCategories: (categories: string[]) => void;
  setTechnicians: (technicians: string[]) => void;
  setStatuses: (statuses: string[]) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  setRecurrence: (recurrence: string | null) => void;
  resetFilters: () => void;
  getActiveFilterCount: () => number;
}

export const useMaintenanceFilters = create<MaintenanceFiltersStore>()(
  persist(
    (set, get) => ({
      filters: DEFAULT_FILTERS,

      setAssets: (assets) =>
        set((state) => ({
          filters: { ...state.filters, assets },
        })),

      setCategories: (categories) =>
        set((state) => ({
          filters: { ...state.filters, categories },
        })),

      setTechnicians: (technicians) =>
        set((state) => ({
          filters: { ...state.filters, technicians },
        })),

      setStatuses: (statuses) =>
        set((state) => ({
          filters: { ...state.filters, statuses },
        })),

      setDateRange: (start, end) =>
        set((state) => ({
          filters: { ...state.filters, dateRange: { start, end } },
        })),

      setRecurrence: (recurrence) =>
        set((state) => ({
          filters: { ...state.filters, recurrence },
        })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      getActiveFilterCount: () => {
        const { filters } = get();
        let count = 0;

        if (filters.assets.length > 0) count++;
        if (filters.categories.length > 0) count++;
        if (filters.technicians.length > 0) count++;
        if (filters.statuses.length > 0) count++;
        if (filters.dateRange.start || filters.dateRange.end) count++;
        if (filters.recurrence) count++;

        return count;
      },
    }),
    {
      name: "maintenance-filters",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
