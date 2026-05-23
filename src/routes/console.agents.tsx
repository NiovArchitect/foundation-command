import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import { MetricCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/agents")({
  head: () => ({ meta: [{ title: "Agent / Hive / Swarm — NIOV Foundation Console" }] }),
  component: () => {
    const { data } = useOverview();
    const a = data?.agents;
    return (
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Agent / Hive / Swarm Operations"
          subtitle="Coordination readiness across agent surfaces. COSMP/DBGI telemetry is FUTURE."
          readiness="PARTIAL"
          generatedAt={data?.generated_at}
        />
        {a && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard label="Feedback Loops" value={a.feedback_loops} readiness="PARTIAL" source={{ kind: "route", ref: "overview.agents.feedback_loops", existing: true }} />
            <MetricCard label="Hive Surface" value={a.hive_surface_status} readiness="PARTIAL" source={{ kind: "route", ref: "overview.agents.hive_surface_status", existing: true }} />
            <MetricCard label="COSMP / DBGI Telemetry" value={a.cosmp_dbgi_telemetry_status} readiness="FUTURE" source={{ kind: "proposed", ref: "COSMP/DBGI", existing: false }} />
          </div>
        )}
        <ScopeBoundaryBanner>
          AI agents, devices, and robotics systems are Foundation-supported entities governed
          through wallets, scopes, policies, and event surfaces — not human Console users.
        </ScopeBoundaryBanner>
        <Link to="/console/reports/$report_id" params={{ report_id: "agent_hive_swarm" }} className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2">
          Open Agent / Hive / Swarm Operations Report →
        </Link>
      </div>
    );
  },
});
