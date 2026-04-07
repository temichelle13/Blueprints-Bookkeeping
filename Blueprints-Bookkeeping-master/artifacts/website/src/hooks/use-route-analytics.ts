import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageview, isAnalyticsInitialized } from "@/lib/analytics";

export function useRouteAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    if (isAnalyticsInitialized()) {
      trackPageview();
    }
  }, [location]);
}
