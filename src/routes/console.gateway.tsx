import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import {
  MetricCard,
  PageHeader,
  ScopeBoundaryBanner,
} from "@/components/console";

export const Route = createFileRoute("/console/gateway")({
  head: () => ({ meta: [{ title: "Gateway Usage — NIOV Foundation Console" }] }),
  component: GatewayPage,
});

function GatewayPage() {
  const { data } = useOverview();
  const g = data?.gateway;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Gateway Usage Monitor"
        subtitle="Operation-class posture across substrate gateway."
        readiness={g?.readiness ?? "PARTIAL"}
        generatedAt={data?.generated_at}
      />
      <ScopeBoundaryBanner tone="warn">
        live_counters_available: false — live gateway counters are not available in P0.
      </ScopeBoundaryBanner>
      {g && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <MetricCard
            label="Operation Classes"
            value={g.operation_classes.length}
            hint={g.operation_classes.join(", ")}
            readiness="PARTIAL"
            source={{ kind: "route", ref: "overview.gateway.operation_classes", existing: true }}
          />
          <MetricCard
            label="Live Counters Available"
            value="false"
            readiness="PARTIAL"
            source={{ kind: "route", ref: "overview.gateway.live_counters_available", existing: true }}
          />
          <MetricCard
            label="Recent Anomalies"
            value={g.recent_anomalies}
            readiness="PARTIAL"
            source={{ kind: "route", ref: "overview.gateway.recent_anomalies", existing: true }}
          />
        </div>
      )}
      <Link
        to="/console/reports/$report_id"
        params={{ report_id: "gateway_ratelimit" }}
        className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
      >
        Open Gateway / Rate-Limit Report →
      </Link>
    </div>
  );
}
