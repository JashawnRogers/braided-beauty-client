import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import type { CurrentUser } from "../account/types";
import { apiGet } from "@/lib/apiClient";

export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const accessToken = params.get("token");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("accessToken", accessToken);

    (async () => {
      try {
        const currentUser = await apiGet<CurrentUser>("/user/me");
        setUser(currentUser);

        if (currentUser.memberStatus === "ADMIN") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/me");
        }
      } catch (err: any) {
        console.error("OAuth callback failed to load user: ", err);
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    })();
  }, [params, navigate, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing in with Google...</p>
    </div>
  );
}
