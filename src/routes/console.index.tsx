import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview, useReports } from "@/hooks/useConsole";
import {
  CommandCenterSection,
  MetricCard,
  PageHeader,
  ReadinessBadge,
  ScopeBoundaryBanner,
  StatusPill,
} from "@/components/console";

export const Route = createFileRoute("/console/")({
  head: () => ({
    meta: [
      { title: "Foundation Command Center — NIOV Foundation Console" },
      {
        name: "description",
        content:
          "Operational control plane for governed memory, scoped intelligence, audit, and enterprise AI infrastructure.",
      },
    ],
  }),
  component: CommandCenter,
});

const src = (ref: string) => ({ kind: "route" as const, ref, existing: true });

function CommandCenter() {
  const { data, isLoading } = useOverview();
  const { data: reportsData } = useReports();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Foundation Command Center"
        subtitle="Operational control plane for governed memory, scoped intelligence, audit, and enterprise AI infrastructure."
        readiness={data?.foundation.readiness ?? "PARTIAL"}
        generatedAt={data?.generated_at}
      />

      {isLoading || !data ? (
        <div className="text-xs text-muted-foreground">Loading Foundation state…</div>
      ) : (
        <>
          {/* Foundation Status */}
          <CommandCenterSection
            title="Foundation Status"
            description="Substrate-wide posture and program states."
            readiness={data.foundation.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricCard
                label="Environment"
                value={data.foundation.environment}
                readiness="PARTIAL"
                source={src("overview.foundation.environment")}
              />
              <MetricCard
                label="Commit"
                value={<span className="mono text-base">{data.foundation.commit ?? "—"}</span>}
                readiness="PARTIAL"
                source={src("overview.foundation.commit")}
              />
              <MetricCard
                label="CI Status"
                value={data.foundation.ci_status}
                readiness="PARTIAL"
                source={src("overview.foundation.ci_status")}
              />
              <MetricCard
                label="Open Critical Gaps"
                value={data.foundation.open_critical_gaps}
                readiness="PARTIAL"
                source={src("overview.foundation.open_critical_gaps")}
              />
              <MetricCard
                label="GOVSEC-5"
                value={data.foundation.govsec5_status}
                readiness="LIVE"
                source={src("overview.foundation.govsec5_status")}
              />
              <MetricCard
                label="ADR-0049"
                value={data.foundation.adr_0049_status}
                readiness="PARTIAL"
                source={src("overview.foundation.adr_0049_status")}
              />
              <MetricCard
                label="GAP-O7"
                value={data.foundation.gap_o7_status}
                readiness="PARTIAL"
                source={src("overview.foundation.gap_o7_status")}
              />
              <MetricCard
                label="GOVSEC-7"
                value={data.foundation.govsec7_status}
                readiness="FUTURE"
                source={src("overview.foundation.govsec7_status")}
              />
              <MetricCard
                label="Console-1"
                value={data.foundation.console1_status}
                readiness="PARTIAL"
                source={src("overview.foundation.console1_status")}
              />
            </div>
          </CommandCenterSection>

          {/* Substrate Health */}
          <CommandCenterSection
            title="Substrate Health"
            description="Core services and substrate dependencies."
            readiness={data.health.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {(["api", "database", "redis", "cosmp", "dbgi"] as const).map((k) => (
                <MetricCard
                  key={k}
                  label={k.toUpperCase()}
                  value={
                    <StatusPill
                      tone={
                        data.health[k] === "ok"
                          ? "ok"
                          : data.health[k] === "degraded"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {data.health[k]}
                    </StatusPill>
                  }
                  readiness={k === "cosmp" || k === "dbgi" ? "FUTURE" : "PARTIAL"}
                  source={src(`overview.health.${k}`)}
                />
              ))}
            </div>
          </CommandCenterSection>

          {/* Governance Posture */}
          <CommandCenterSection
            title="Governance Posture"
            description="Audit volume, escalations, and break-glass lifecycle."
            readiness={data.governance.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricCard
                label="Open Escalations"
                value={data.governance.open_escalations}
                readiness="PARTIAL"
                source={src("overview.governance.open_escalations")}
              />
              <MetricCard
                label="Pending Dual-Control"
                value={data.governance.pending_dual_control}
                readiness="PARTIAL"
                source={src("overview.governance.pending_dual_control")}
              />
              <MetricCard
                label="Break-Glass Active"
                value={data.governance.break_glass_active}
                readiness="PARTIAL"
                source={src("overview.governance.break_glass_active")}
              />
              <MetricCard
                label="Break-Glass Used"
                value={data.governance.break_glass_used}
                readiness="PARTIAL"
                source={src("overview.governance.break_glass_used")}
              />
              <MetricCard
                label="Break-Glass Reviewed"
                value={data.governance.break_glass_reviewed}
                readiness="PARTIAL"
                source={src("overview.governance.break_glass_reviewed")}
              />
              <MetricCard
                label="Recent Audit Events"
                value={data.governance.recent_audit_events}
                readiness="LIVE"
                source={src("overview.governance.recent_audit_events")}
              />
              <MetricCard
                label="Recent Rate-Limited"
                value={data.governance.recent_rate_limited_events}
                readiness="PARTIAL"
                source={src("overview.governance.recent_rate_limited_events")}
              />
            </div>
          </CommandCenterSection>

          {/* Wallet & Entity Activity */}
          <CommandCenterSection
            title="Wallet & Entity Activity"
            description="Entity, wallet, and twin posture across actor types."
            readiness={data.entities.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MetricCard
                label="Total Entities"
                value={data.entities.total_entities.toLocaleString()}
                readiness="PARTIAL"
                source={src("overview.entities.total_entities")}
              />
              <MetricCard
                label="Total Orgs"
                value={data.entities.total_orgs.toLocaleString()}
                readiness="PARTIAL"
                source={src("overview.entities.total_orgs")}
              />
              <MetricCard
                label="Active Twins"
                value={data.entities.active_twins.toLocaleString()}
                readiness="PARTIAL"
                source={src("overview.entities.active_twins")}
              />
              <MetricCard
                label="Active Sessions"
                value={data.entities.active_sessions ?? "—"}
                readiness="PARTIAL"
                source={src("overview.entities.active_sessions")}
              />
            </div>
            <div className="mt-3 rounded-md border border-border bg-card p-3">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                By Type
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.entities.by_type).map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-sm border border-border bg-surface px-2 py-0.5 text-[11px] text-foreground"
                  >
                    <span className="text-muted-foreground">{k}: </span>
                    <span className="mono">{v}</span>
                  </span>
                ))}
              </div>
            </div>
          </CommandCenterSection>

          {/* Capsule Activity */}
          <CommandCenterSection
            title="Memory Capsule Activity"
            description="Capsule metadata only. No raw capsule content displayed."
            readiness={data.capsules.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard
                label="Total Capsules"
                value={data.capsules.total_capsules.toLocaleString()}
                readiness="PARTIAL"
                source={src("overview.capsules.total_capsules")}
              />
              <MetricCard
                label="Recent Capsule Events"
                value={data.capsules.recent_capsule_events.toLocaleString()}
                readiness="PARTIAL"
                source={src("overview.capsules.recent_capsule_events")}
              />
              <div className="rounded-md border border-border bg-card p-4 text-[12px] text-muted-foreground">
                No raw capsule content displayed.
              </div>
            </div>
          </CommandCenterSection>

          {/* Gateway */}
          <CommandCenterSection
            title="Gateway & API Usage"
            description="Operation-class posture. Live counters are not yet available."
            readiness={data.gateway.readiness}
            banner={
              <div className="border-b border-border bg-warning/10 px-4 py-1.5 text-[11px] text-warning">
                live_counters_available: false — live gateway counters are not available in P0.
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard
                label="Operation Classes"
                value={data.gateway.operation_classes.length}
                hint={data.gateway.operation_classes.join(", ")}
                readiness="PARTIAL"
                source={src("overview.gateway.operation_classes")}
              />
              <MetricCard
                label="Live Counters Available"
                value="false"
                readiness="PARTIAL"
                source={src("overview.gateway.live_counters_available")}
              />
              <MetricCard
                label="Recent Anomalies"
                value={data.gateway.recent_anomalies}
                readiness="PARTIAL"
                source={src("overview.gateway.recent_anomalies")}
              />
            </div>
          </CommandCenterSection>

          {/* Compliance */}
          <CommandCenterSection
            title="Compliance & Proof"
            description="Lawful-basis events, regulator access, and compliance checks."
            readiness={data.compliance.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard
                label="Lawful-Basis Events (recent)"
                value={data.compliance.lawful_basis_events_recent}
                readiness="PARTIAL"
                source={src("overview.compliance.lawful_basis_events_recent")}
              />
              <MetricCard
                label="Regulator Access (recent)"
                value={data.compliance.regulator_access_events_recent}
                readiness="PARTIAL"
                source={src("overview.compliance.regulator_access_events_recent")}
              />
              <MetricCard
                label="Compliance Checks (recent)"
                value={data.compliance.compliance_checks_recent}
                readiness="PARTIAL"
                source={src("overview.compliance.compliance_checks_recent")}
              />
            </div>
          </CommandCenterSection>

          {/* Exchange */}
          <CommandCenterSection
            title="Permissioned Intelligence Exchange"
            description="Cohort-based exchange posture."
            readiness={data.exchange.readiness}
            banner={
              <div className="border-b border-border bg-info/10 px-4 py-1.5 text-[11px] text-info">
                Market pricing is mocked/future and must not be treated as live.
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard
                label="Monetization Events (recent)"
                value={data.exchange.monetization_events_recent}
                readiness="MOCK"
                source={src("overview.exchange.monetization_events_recent")}
              />
              <MetricCard
                label="Market Surface"
                value={data.exchange.market_surface_status}
                readiness="PARTIAL"
                source={src("overview.exchange.market_surface_status")}
              />
              <MetricCard
                label="Cohort Pricing"
                value={data.exchange.cohort_pricing_status}
                readiness="FUTURE"
                source={src("overview.exchange.cohort_pricing_status")}
              />
            </div>
          </CommandCenterSection>

          {/* Agents */}
          <CommandCenterSection
            title="Agent / Hive / Swarm Operations"
            description="Agent coordination readiness across substrate."
            readiness={data.agents.readiness}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricCard
                label="Feedback Loops"
                value={data.agents.feedback_loops}
                readiness="PARTIAL"
                source={src("overview.agents.feedback_loops")}
              />
              <MetricCard
                label="Hive Surface"
                value={data.agents.hive_surface_status}
                readiness="PARTIAL"
                source={src("overview.agents.hive_surface_status")}
              />
              <MetricCard
                label="COSMP / DBGI Telemetry"
                value={data.agents.cosmp_dbgi_telemetry_status}
                readiness="FUTURE"
                source={src("overview.agents.cosmp_dbgi_telemetry_status")}
              />
            </div>
          </CommandCenterSection>

          {/* Reports */}
          <CommandCenterSection
            title="Reports"
            description="Catalog readiness across the 18-report set."
            readiness="PARTIAL"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <MetricCard
                label="Total Reports"
                value={data.reports.total_reports}
                readiness="PARTIAL"
                source={src("overview.reports.total_reports")}
              />
              <MetricCard
                label="Live"
                value={data.reports.live_ready}
                readiness="LIVE"
                source={src("overview.reports.live_ready")}
              />
              <MetricCard
                label="Partial"
                value={data.reports.partial}
                readiness="PARTIAL"
                source={src("overview.reports.partial")}
              />
              <MetricCard
                label="Mock"
                value={data.reports.mock_only}
                readiness="MOCK"
                source={src("overview.reports.mock_only")}
              />
              <MetricCard
                label="Future"
                value={data.reports.future}
                readiness="FUTURE"
                source={src("overview.reports.future")}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {reportsData?.reports.slice(0, 6).map((r) => (
                <Link
                  key={r.report_id}
                  to="/console/reports/$report_id"
                  params={{ report_id: r.report_id }}
                  className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-2 py-1 text-[11px] text-foreground hover:bg-surface-2"
                >
                  <span>{r.display_name}</span>
                  <ReadinessBadge value={r.readiness} />
                </Link>
              ))}
              <Link
                to="/console/reports"
                className="inline-flex items-center rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-foreground hover:bg-accent/40"
              >
                Open Report Catalog →
              </Link>
            </div>
          </CommandCenterSection>

          <ScopeBoundaryBanner>
            NIOV Foundation supports many actor types. This Console is the substrate-level
            operator surface, not the end-user interface for every actor.
          </ScopeBoundaryBanner>
        </>
      )}
    </div>
  );
}
