import { redirect } from "react-router";
import { httpClient } from "./httpClient";

export async function apiGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    redirect("/login");
  }

  const res = await httpClient(path);

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("accessToken");
    throw redirect("/login");
  }

  return res.json as T;
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const res = await httpClient(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  return res.json as TResponse;
}

export async function apiPut<TBody, TResponse>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const res = await httpClient(path, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  return res.json as TResponse;
}
