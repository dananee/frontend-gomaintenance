import { useQuery } from "@tanstack/react-query";
import { getWarehouses, getActiveWarehouses, Warehouse } from "../api/inventory";

export const useWarehouses = (activeOnly = false) => {
  return useQuery<Warehouse[]>({
    queryKey: ["warehouses", { activeOnly }],
    queryFn: async () => {
      if (activeOnly) {
        return getActiveWarehouses();
      }
      const resp = await getWarehouses();
      return resp.data;
    },
  });
};
