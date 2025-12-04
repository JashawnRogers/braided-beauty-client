import type { UserDashboardDTO } from "../types";
import { apiGet } from "@/lib/apiClient";

export async function userDashboardLoader() {
  const url = "/user/dashboard/me";

  const data = apiGet<UserDashboardDTO>(url);

  return data;
}
