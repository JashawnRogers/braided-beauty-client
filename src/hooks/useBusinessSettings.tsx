import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type BusinessSettings = {
  companyAddress: string;
  companyPhoneNumber: string;
  companyEmail: string;
};

export function useBusinessSettings() {
  return useQuery({
    queryKey: ["businessSettings"],
    queryFn: () => apiGet<BusinessSettings>("/business/settings"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour in cache
    retry: 1,
  });
}
