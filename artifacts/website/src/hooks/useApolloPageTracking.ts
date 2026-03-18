import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    trackingFunctions?: {
      sendPageVisitEvent?: (page: string) => Promise<void> | void;
    };
  }
}

export function useApolloPageTracking(): void {
  const [location] = useLocation();

  useEffect(() => {
    const pageUrl = window.location.href;
    window.trackingFunctions?.sendPageVisitEvent?.(pageUrl);
  }, [location]);
}
