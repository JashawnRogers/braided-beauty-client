import { useQuery } from "@tanstack/react-query";
import { apiPublicGet } from "@/lib/apiClient";

export type BusinessHoursResponseDTO = {
  readonly id: string;
  readonly dayOfWeek: string;
  readonly openTime: string;
  readonly closeTime: string;
  readonly isClosed: boolean;
};

export function useBusinessHours() {
  return useQuery({
    queryKey: ["business-hours"],
    queryFn: () => apiPublicGet<BusinessHoursResponseDTO[]>("/hours"),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
