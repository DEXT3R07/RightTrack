import { createContext, useContext } from "react";

export const SiteNavContext = createContext(null);

export function useSiteNav() {
  const ctx = useContext(SiteNavContext);
  if (!ctx) throw new Error("useSiteNav must be used within a SiteNavContext.Provider");
  return ctx;
}
