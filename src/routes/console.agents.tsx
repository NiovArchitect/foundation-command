import { createFileRoute } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import { EcosystemDomainPage, MetricCard, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/agents")({
  head: () => ({ meta: [{ title: "Agent / Hive / Swarm — NIOV Foundation Console" }] }),
  component: () => {
    const { data } = useOverview();
    const a = data?.agents;
    return (
      <EcosystemDomainPage
        title="Agent / Hive / Swarm Operations"
        subtitle="Coordination readiness across agent surfaces. COSMP/DBGI telemetry is FUTURE."
        readiness="PARTIAL"
        entityType="agent"
        scopeBoundary="AI agents, devices, and robotics systems are Foundation-supported entities governed through wallets, scopes, policies, and event surfaces — not human Console users."
        reports={[
          { id: "agent_hive_swarm", label: "Agent / Hive / Swarm Operations", readiness: "PARTIAL" },
        ]}
        overview={
          <>
            {a && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <MetricCard label="Feedback Loops" value={a.feedback_loops} readiness="PARTIAL" source={{ kind: "route", ref: "overview.agents.feedback_loops", existing: true }} />
                <MetricCard label="Hive Surface" value={a.hive_surface_status} readiness="PARTIAL" source={{ kind: "route", ref: "overview.agents.hive_surface_status", existing: true }} />
                <MetricCard label="COSMP / DBGI Telemetry" value={a.cosmp_dbgi_telemetry_status} readiness="FUTURE" source={{ kind: "proposed", ref: "COSMP/DBGI", existing: false }} />
              </div>
            )}
            <ScopeBoundaryBanner>
              Agents are governed through wallets, scopes, and event surfaces. COSMP/DBGI telemetry
              remains FUTURE.
            </ScopeBoundaryBanner>
          </>
        }
        sourceMappingEntries={[
          { label: "overview.agents", value: "/api/v1/console/overview" },
          { label: "entities (agent)", value: "/api/v1/console/entities?entity_type=agent" },
          { label: "COSMP / DBGI telemetry", value: "proposed (FUTURE)", tone: "warn" },
        ]}
      />
    );
  },
});
