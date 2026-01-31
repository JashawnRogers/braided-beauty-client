import { createContext, useContext } from "react";
import {
  useBusinessSettings,
  BusinessSettings,
} from "../hooks/useBusinessSettings";

interface ProviderProps {
  readonly children: React.ReactNode;
}

const businessSettingsContext = createContext<BusinessSettings | null>(null);

export function BusinessSettingsProvider({ children }: ProviderProps) {
  const { data } = useBusinessSettings();

  return (
    <businessSettingsContext.Provider value={data || null}>
      {children}
    </businessSettingsContext.Provider>
  );
}

export function useBusinessSettingsContext() {
  return useContext(businessSettingsContext);
}
