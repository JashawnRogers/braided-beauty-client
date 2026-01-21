import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import type { CurrentUser } from "../account/types";
import { refreshAccessToken } from "@/lib/authClient";

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await refreshAccessToken();

      if (!token) {
        setError("OAuth succeeded but refresh failed.");
        return;
      }

      const meRes = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}/user/me`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!meRes.ok) {
        setError("OAuth succeeded but failed to load user.");
        return;
      }

      const currentUser = (await meRes.json()) as CurrentUser;
      setUser(currentUser);

      navigate(
        currentUser.memberStatus === "ADMIN"
          ? "/dashboard/admin"
          : "/dashboard/me",
        {
          replace: true,
        }
      );
    })();
  }, [navigate, setUser]);

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing in with Google...</p>
    </div>
  );
}
