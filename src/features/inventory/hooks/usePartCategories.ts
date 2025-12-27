import { useQuery } from "@tanstack/react-query";
import { getPartCategories } from "../api/getPartCategories";

export const usePartCategories = () => {
  return useQuery({
    queryKey: ["part-categories"],
    queryFn: getPartCategories,
  });
};
