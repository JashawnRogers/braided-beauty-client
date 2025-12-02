let refreshPromise: Promise<string | null> | null = null;

async function actuallyRefresh(): Promise<string | null> {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_API_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    localStorage.removeItem("accessToken");
    return null;
  }

  const data = (await res.json()) as { accessToken: string };
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

// Make sure multiple concurrent 401s share one refresh request
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = actuallyRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function hardLogout() {
  try {
    await fetch(`${import.meta.env.VITE_SERVER_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Logout request failed", err);
  }

  localStorage.removeItem("accessToken");
  window.location.href = import.meta.env.VITE_CLIENT_API_URL;
}
