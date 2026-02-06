import { hardLogout, refreshAccessToken } from "./authClient";

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL;
const ADMIN_API_BASE_URL = import.meta.env.VITE_SERVER_ADMIN_API_URL;

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  let url = "";
  if (
    path === "/appointment/closeout-cash" ||
    path === "/appointment/closeout-stripe"
  ) {
    url = `${ADMIN_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  } else {
    url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  }

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const opts: RequestInit = {
    credentials: "include",
    ...init,
    headers,
  };

  const res = await fetch(url, opts);

  if (res.status === 401 || res.status === 403) {
    const isAuthEndpoint =
      url.endsWith("/api/v1/auth/login") ||
      url.endsWith("/api/v1/auth/refresh") ||
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/refresh");

    if (retry && token && !isAuthEndpoint) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        hardLogout();
        throw new Error("Session expired");
      }

      // Retry once with new token
      return request<T>(path, init, false);
    }

    hardLogout();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch {
      /* ignore */
    }

    throw new Error(data?.message || data?.error || "Request failed");
  }

  if (res.status === 204) return undefined as T;

  // Some endpoints may legitimately return 200 with an empty body (e.g. null),
  // which will break res.json(). Handle that safely.
  const text = await res.text();
  if (!text) return undefined as T;

  // If it's JSON, parse it. Otherwise return raw text.
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.parse(text) as T;
  }

  return text as unknown as T;
}

async function publicRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("PUBLIC REQUEST URL: " + url);

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch {}
    throw new Error(data?.message || data?.error || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGet = <T>(path: string) => request<T>(path);
export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: "DELETE" });

export const apiPublicGet = <T>(path: string) => publicRequest<T>(path);
export const apiPublicPost = <T>(path: string, body?: unknown) =>
  publicRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
