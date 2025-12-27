import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/suppliers";

export const useSuppliers = (params = {}) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
};
