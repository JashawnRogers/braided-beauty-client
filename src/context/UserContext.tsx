import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { apiGet } from "@/lib/apiClient";
import type { CurrentUser } from "@/features/account/types";

type UserContextValue = {
  user: CurrentUser | null;
  setUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isAuthenticated: boolean;
};

type UserProviderProps = {
  children: ReactNode;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentUser = await apiGet<CurrentUser>(
        `${import.meta.env.VITE_SERVER_API_URL}/user/dashboard/me`
      );

      setUser(currentUser);
    } catch (err) {
      console.error(err);
      setError("Unable to load user information.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      setUser,
      isLoading,
      error,
      refetch: loadUser,
      isAuthenticated: !!user,
    }),
    [user, isLoading, error, loadUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUeser must be used within UserProvider");
  return context;
}
