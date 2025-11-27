import type { UserDashboardDTO } from "../types";
import { apiGet } from "@/lib/apiClient";

export async function userDashboardLoader() {
  const url = `${import.meta.env.VITE_SERVER_API_URL}/user/dashboard/me`;

  const data = apiGet<UserDashboardDTO>(url);

  return data;
}
