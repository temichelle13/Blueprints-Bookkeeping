import { useState, useEffect, useCallback } from "react";
import { getApiRoot } from "@/lib/api";
import { SEO } from "@/components/SEO";

interface HealthData {
  status: "ok" | "degraded";
  db: "ok" | "error";
  timestamp: string;
}

const POLL_INTERVAL = 30_000;

export default function Status() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${getApiRoot()}/healthz`);
      const data = await res.json();
      setHealth(data);
      setError(false);
    } catch {
      setHealth(null);
      setError(true);
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <section className="py-20 px-4 min-h-[60vh]">
      <SEO title="System Status" noindex />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
        <p className="text-gray-500 mb-8">
          Real-time health of our services. Updated every 30 seconds.
        </p>

        {loading && !health && !error && (
          <div className="text-center py-12 text-gray-400">
            Checking services...
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            <ServiceCard
              name="API Server"
              status={
                error
                  ? "error"
                  : health?.status === "ok"
                    ? "ok"
                    : health?.status === "degraded"
                      ? "degraded"
                      : "error"
              }
            />
            <ServiceCard
              name="Database"
              status={error ? "error" : health?.db === "ok" ? "ok" : "error"}
            />
          </div>
        )}

        {health && !error && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Overall:{" "}
                <span
                  className={
                    health.status === "ok"
                      ? "text-green-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {health.status === "ok"
                    ? "All Systems Operational"
                    : "Degraded"}
                </span>
              </span>
              {lastChecked && (
                <span>Last checked: {formatTime(lastChecked)}</span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between text-sm text-red-600">
              <span className="font-semibold">Unable to reach the API</span>
              {lastChecked && (
                <span className="text-red-400">
                  Last checked: {formatTime(lastChecked)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({
  name,
  status,
}: {
  name: string;
  status: "ok" | "degraded" | "error";
}) {
  const colorMap = {
    ok: {
      badge: "bg-green-100 text-green-700",
      dot: "bg-green-500",
      label: "Operational",
    },
    degraded: {
      badge: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-500",
      label: "Degraded",
    },
    error: {
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500",
      label: "Down",
    },
  };
  const style = colorMap[status];

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <span className="text-gray-900 font-medium">{name}</span>
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${style.badge}`}
      >
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        {style.label}
      </span>
    </div>
  );
}
