import { fetchUtils, HttpError } from "react-admin";

export const httpClient: typeof fetchUtils.fetchJson = async (
  url,
  options = {}
) => {
  const opts = {
    ...options,
    headers: new Headers(options.headers || {}),
  };
  (opts.headers as Headers).set("Accept", "application/json");

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
