import { fetchUtils, HttpError } from "react-admin";
import { hardLogout, refreshAccessToken } from "./authClient";

type FetchJson = typeof fetchUtils.fetchJson;

const doFecthJson: typeof fetchUtils.fetchJson = async (
  url,
  options = {},
  retry = true as any
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
    const status = e?.status;

    const isAuthEndpoint =
      typeof url === "string" &&
      (url.includes("/api/v1/auth/login") ||
        url.includes("/api/v1/auth/refresh"));

    // Only try refresh once, and never for login/refresh calls themselves
    if (retry && (status === 401 || status === 403) && !isAuthEndpoint) {
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          hardLogout();
          throw e;
        }

        // Retry original request with updated token
        const retryHeaders = new Headers(opts.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newToken}`);
        opts.headers = retryHeaders;

        return await fetchUtils.fetchJson(url, opts);
      } catch (refreshErr) {
        console.error("Failed to generate refresh token", refreshErr);
        hardLogout();
        throw e;
      }
    }

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

export const httpClient: FetchJson = (url, options = {}) =>
  doFecthJson(url, options) as any;
