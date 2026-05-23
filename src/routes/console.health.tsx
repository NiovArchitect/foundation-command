import { createFileRoute } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import { MetricCard, PageHeader, StatusPill, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/health")({
  head: () => ({ meta: [{ title: "Substrate Health — NIOV Foundation Console" }] }),
  component: HealthPage,
});

function HealthPage() {
  const { data } = useOverview();
  const h = data?.health;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Substrate Health"
        subtitle="Core service posture for API, database, redis, COSMP, and DBGI."
        readiness={h?.readiness ?? "PARTIAL"}
        generatedAt={data?.generated_at}
      />
      {h && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {(["api", "database", "redis", "cosmp", "dbgi"] as const).map((k) => (
            <MetricCard
              key={k}
              label={k.toUpperCase()}
              value={
                <StatusPill
                  tone={h[k] === "ok" ? "ok" : h[k] === "degraded" ? "warn" : "neutral"}
                >
                  {h[k]}
                </StatusPill>
              }
              readiness={k === "cosmp" || k === "dbgi" ? "FUTURE" : "PARTIAL"}
              source={{ kind: "route", ref: `overview.health.${k}`, existing: true }}
            />
          ))}
        </div>
      )}
      <ScopeBoundaryBanner tone="warn">
        COSMP and DBGI telemetry surfaces are FUTURE and not implemented in this prototype.
      </ScopeBoundaryBanner>
    </div>
  );
}
