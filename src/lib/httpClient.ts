import { fetchUtils, HttpError } from "react-admin";

export const httpClient: typeof fetchUtils.fetchJson = async (
  url,
  options = {}
) => {
  const opts: RequestInit = {
    credentials: "include",
    ...options,
  };

  const headers = new Headers(opts.headers || {});
  headers.set("Accept", "application/json");

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  opts.headers = headers;

  try {
    return await fetchUtils.fetchJson(url, opts);
  } catch (e: any) {
    // e is an HttpError from React Admin
    const rawBody = e?.body;
    let data: any = rawBody;

    if (typeof rawBody === "string") {
      try {
        data = JSON.parse(rawBody);
      } catch {
        /* ignore */
      }
    }

    const msg =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors)
        ? data.errors.map((x: any) => x.message || x).join(", ")
        : undefined) ||
      e.message ||
      "Request failed";

    throw new HttpError(msg, e.status, data ?? rawBody);
  }
};
