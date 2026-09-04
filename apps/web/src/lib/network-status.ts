import { useEffect, useState } from "react";

/**
 * Check if the device is online
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") {
    return true; // Assume online on server
  }
  return navigator.onLine;
}

/**
 * Check if the network is actually reachable
 * (not just "online" status)
 */
export async function isNetworkReachable(): Promise<boolean> {
  if (!isOnline()) {
    return false;
  }

  try {
    // Simple health check
    const response = await fetch("/api/health", {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Hook to track network status
 */
export function useNetworkStatus() {
  const [online, setOnline] = useState(isOnline());
  const [reachability, setReachability] = useState<boolean | null>(null);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => {
      setOnline(false);
      setReachability(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial reachability check
    if (online) {
      isNetworkReachable().then(setReachability);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [online]);

  // Re-check reachability when coming back online
  useEffect(() => {
    if (online && reachability === false) {
      isNetworkReachable().then(setReachability);
    }
  }, [online, reachability]);

  return {
    online,
    reachability,
    isReachable: online && reachability !== false,
  };
}
