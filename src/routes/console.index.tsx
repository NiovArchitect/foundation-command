import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview, useAudit, useReports } from "@/hooks/useConsole";
import {
  Accordion,
  CommandCenterSection,
  CriticalAttentionQueue,
  DemoGuidePanel,
  FoundationPlaneCard,
  LayerBadge,
  LiveAuthRequiredState,
  MetricCard,
  PageHeader,
  PageMeaningPanel,
  ReadinessBadge,
  StatusPill,
  Tabs,
  HelpTooltip,
  type ConsoleLayer,
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
  const { data, isLoading, error } = useOverview();
  const { data: auditData } = useAudit({ take: 8 });
  const { data: reportsData } = useReports();
  const [tab, setTab] = React.useState("health");
  const [demoOpen, setDemoOpen] = React.useState(false);

  if (isLoading) {
    return <div className="text-xs text-muted-foreground">Loading Foundation state…</div>;
  }

  // In live mode a missing/invalid token makes the read fail closed. Surface an
  // explicit auth-required state instead of stale data or a perpetual spinner.
  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Foundation Command Center"
          subtitle="Substrate-wide operational state."
          readiness="PARTIAL"
        />
        <LiveAuthRequiredState />
      </div>
    );
  }

  const critical: Parameters<typeof CriticalAttentionQueue>[0]["items"] = [];
  if (data.governance.open_escalations > 0)
    critical.push({
      severity: "warn",
      label: `${data.governance.open_escalations} open escalations awaiting dual-control review`,
      source: "Governance · Escalations",
      href: "/console/governance/escalations",
    });
  if (data.governance.break_glass_active > 0)
    critical.push({
      severity: "warn",
      label: `${data.governance.break_glass_active} active break-glass grant(s) — justification excluded by design`,
      source: "Governance · Break-Glass",
      href: "/console/governance/break-glass",
    });
  if (data.gateway.recent_anomalies > 0)
    critical.push({
      severity: "warn",
      label: `${data.gateway.recent_anomalies} recent gateway anomaly signal(s)`,
      source: "Gateway",
      href: "/console/gateway",
    });
  if (!data.gateway.live_counters_available)
    critical.push({
      severity: "info",
      label: "Live gateway counters not available in P0 (live_counters_available: false)",
      source: "Gateway readiness",
      href: "/console/gateway",
    });
  if (data.agents.cosmp_dbgi_telemetry_status === "FUTURE")
    critical.push({
      severity: "info",
      label: "COSMP / DBGI telemetry FUTURE — execution-plane telemetry not yet wired",
      source: "Agents / Execution plane",
      href: "/console/agents",
    });
  if (data.foundation.gap_o7_status === "OPEN")
    critical.push({
      severity: "warn",
      label: "GAP-O7 remains OPEN",
      source: "Foundation governance",
      href: "/console",
    });

  return (
    <div className="flex flex-col gap-5">
      {/* Hero — plain-English Foundation framing */}
      <section className="overflow-hidden rounded-md border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              NIOV Foundation Command Home
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-foreground/90">
              The governed substrate for memory, identity, governance, and scoped intelligence —
              where applications like Otzar can be built on top.
            </p>
            <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
              Use this Console to inspect entity posture, governance, proof, reporting, and
              application-readiness without exposing raw capsule content or write controls.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <StatusPill tone="info">Governed substrate</StatusPill>
              <StatusPill tone="neutral">Control plane</StatusPill>
              <StatusPill tone="warn">Otzar-ready application layer</StatusPill>
              <StatusPill tone="neutral">Read-only Console</StatusPill>
              <ReadinessBadge value={data.foundation.readiness} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="rounded-sm border border-border bg-surface-2 px-3 py-1.5 text-[11px] font-medium text-foreground hover:bg-accent/40"
          >
            Demo Guide →
          </button>
        </div>
      </section>

      {/* What this page means */}
      <PageMeaningPanel
        layer="Control-plane"
        body="The NIOV Foundation is the governed substrate for memory, identity, governance, and scoped intelligence — the control plane applications are built on. This Console is the read-only operational command and control view of that substrate, not just a dashboard of disconnected backend screens."
        bullets={[
          "Foundation = the governed substrate (control plane).",
          "Otzar and other applications build on top of the Foundation.",
          "Console = read-only operational command/control view.",
          "Mock-first by default; live mode requires an operator Bearer token.",
        ]}
      />

      {/* Start here — visible guided demo path */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Start here</h2>
        <p className="text-[11px] text-muted-foreground">
          A guided path for a first-time viewer or YC / investor demo.
        </p>
        <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
          {[
            {
              n: 1,
              label: "Check Foundation Mode",
              note: "Confirm MOCK / LIVE, API base, and token status (top banner / Console Access).",
              to: "/console/access",
            },
            {
              n: 2,
              label: "Read the Foundation Health",
              note: "Understand substrate posture and readiness.",
              to: "/console/health",
            },
            {
              n: 3,
              label: "Inspect Entity Registry",
              note: "See governed entities and metadata only — never raw capsule content.",
              to: "/console/entities",
            },
            {
              n: 4,
              label: "Review Governance & Audit",
              note: "See how reads, break-glass, and escalations are controlled.",
              to: "/console/governance/audit",
            },
            {
              n: 5,
              label: "Open Reports & Compliance",
              note: "See report-backed observability and compliance posture.",
              to: "/console/reports",
            },
            {
              n: 6,
              label: "Understand Otzar Readiness",
              note: "See how Otzar can build on the Foundation (application-layer preview).",
              to: "/console/ecosystem",
            },
            {
              n: 7,
              label: "Connect Live Backend",
              note: "Use Console Access to set a memory-only token for a local live smoke.",
              to: "/console/access",
            },
          ].map((s) => (
            <li key={s.n}>
              <a href={s.to} className="flex items-start gap-3 px-3 py-2 hover:bg-surface-2">
                <span className="mono mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-2 text-[10px] text-foreground">
                  {s.n}
                </span>
                <span className="min-w-0">
                  <span className="text-[12px] font-medium text-foreground">{s.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{s.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Primary status cards — where to go */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Where to go</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <PrimaryCard
            title="Foundation Health"
            layer="Control-plane"
            to="/console/health"
            blurb="Substrate service posture — API, database, redis, and readiness."
          />
          <PrimaryCard
            title="Entity Registry"
            layer="Control-plane"
            to="/console/entities"
            blurb="Governed entity and wallet metadata only — never raw capsule content."
          />
          <PrimaryCard
            title="Governance & Audit"
            layer="Control-plane"
            to="/console/governance/audit"
            blurb="Hash-chained traceability; reads are audited as CONSOLE_READ; admin-controlled via can_admin_niov."
          />
          <PrimaryCard
            title="Reports & Compliance"
            layer="Report-backed"
            to="/console/reports"
            blurb="Report-backed observability and compliance export surfaces. Exports are disabled in P0."
          />
          <PrimaryCard
            title="Integrations / API"
            layer="Control-plane"
            to="/console/gateway"
            blurb="Gateway and developer integration surface for future app / API access. Live counters are future."
          />
          <PrimaryCard
            title="Otzar Readiness"
            layer="Preview"
            to="/console/ecosystem"
            blurb="Application-layer preview — how Otzar can build on the Foundation's governed rails."
          />
        </div>
      </section>

      {/* Otzar builds on the Foundation */}
      <section className="overflow-hidden rounded-md border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Otzar builds on the Foundation</h2>
          <LayerBadge layer="Preview" />
        </div>
        <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
          The Foundation is the governed substrate. Otzar is an application layer built on top of
          it. The Foundation governs identity and entity state, scoped memory / data surfaces, proof
          and reporting, audit, and integration readiness — and Otzar can consume these governed
          rails to become an autonomous enterprise application.
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Application-layer preview. Otzar is not part of this repository; this Console shows the
          Foundation rails an application like Otzar can be built on.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <a
            href="/console/ecosystem"
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground hover:bg-surface-2"
          >
            Ecosystem Overview →
          </a>
          <a
            href="/console/entities"
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground hover:bg-surface-2"
          >
            Governed Entities →
          </a>
        </div>
      </section>

      {/* B. Critical Attention Queue */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Critical Attention Queue</h2>
          <HelpTooltip term="Readiness" />
        </div>
        <CriticalAttentionQueue items={critical} />
      </section>

      {/* C. Foundation Planes */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground">Foundation Planes</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FoundationPlaneCard
            title="Memory Plane"
            description="Metadata-level visibility into governed memory capsules. P0 shows counts and movement signals only, never raw capsule content."
            readiness="PARTIAL"
            links={[
              { label: "Memory Capsules", to: "/console/capsules" },
              { label: "Entity Registry", to: "/console/entities" },
              { label: "Capsule Movement", to: "/console/reports/capsule_movement" as string },
            ]}
          />
          <FoundationPlaneCard
            title="Permission Plane"
            description="Visibility into capabilities, sessions, access boundaries, and permission-related readiness."
            readiness="PARTIAL"
            links={[
              { label: "Capabilities", to: "/console/capabilities" },
              { label: "Entity Registry", to: "/console/entities" },
              {
                label: "Permission / Revocation",
                to: "/console/reports/permission_revocation" as string,
              },
            ]}
          />
          <FoundationPlaneCard
            title="Governance Plane"
            description="Read-only view of audit, escalation, break-glass, and governance controls."
            readiness="LIVE"
            links={[
              { label: "Audit Center", to: "/console/governance/audit" },
              { label: "Escalations", to: "/console/governance/escalations" },
              { label: "Break-Glass", to: "/console/governance/break-glass" },
            ]}
          />
          <FoundationPlaneCard
            title="Execution Plane"
            description="Readiness surface for agents, hives, swarms, and future COSMP/DBGI telemetry."
            readiness="PARTIAL"
            links={[
              { label: "Agent / Hive / Swarm", to: "/console/agents" },
              {
                label: "Agent Operations Report",
                to: "/console/reports/agent_hive_swarm" as string,
              },
            ]}
          />
          <FoundationPlaneCard
            title="Integration Plane"
            description="Gateway, developer, organization, proof, and exchange readiness surfaces."
            readiness="PARTIAL"
            links={[
              { label: "Gateway", to: "/console/gateway" },
              { label: "Developer", to: "/console/developer" },
              { label: "Organizations", to: "/console/organizations" },
              { label: "Proof", to: "/console/proof" },
              { label: "Exchange", to: "/console/exchange" },
            ]}
          />
        </div>
      </section>

      {/* D. Operational Snapshot Tabs */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Operational Snapshot</h2>
        <Tabs
          tabs={[
            { id: "health", label: "Health" },
            { id: "governance", label: "Governance" },
            { id: "entities", label: "Entities" },
            { id: "capsules", label: "Capsules" },
            { id: "gateway", label: "Gateway" },
            { id: "compliance", label: "Compliance" },
            { id: "exchange", label: "Exchange" },
            { id: "agents", label: "Agents" },
            { id: "reports", label: "Reports" },
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab === "health" && (
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
        )}
        {tab === "governance" && (
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
              label="Recent Audit Events"
              value={data.governance.recent_audit_events}
              readiness="LIVE"
              source={src("overview.governance.recent_audit_events")}
            />
            <MetricCard
              label="Rate-Limited"
              value={data.governance.recent_rate_limited_events}
              readiness="PARTIAL"
              source={src("overview.governance.recent_rate_limited_events")}
            />
          </div>
        )}
        {tab === "entities" && (
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
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(data.entities.by_type).map(([k, v]) => (
                <a
                  key={k}
                  href={`/console/entities?type=${encodeURIComponent(k)}`}
                  className="rounded-sm border border-border bg-surface px-2 py-0.5 text-[11px] text-foreground hover:bg-surface-2"
                >
                  <span className="text-muted-foreground">{k}: </span>
                  <span className="mono">{v}</span>
                </a>
              ))}
            </div>
          </CommandCenterSection>
        )}
        {tab === "capsules" && (
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
        )}
        {tab === "gateway" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard
              label="Operation Classes"
              value={data.gateway.operation_classes.length}
              hint={data.gateway.operation_classes.join(", ")}
              readiness="PARTIAL"
              source={src("overview.gateway.operation_classes")}
            />
            <MetricCard
              label="Live Counters"
              value="false"
              warning="Not available in P0"
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
        )}
        {tab === "compliance" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard
              label="Lawful-Basis Events"
              value={data.compliance.lawful_basis_events_recent}
              readiness="PARTIAL"
              source={src("overview.compliance.lawful_basis_events_recent")}
            />
            <MetricCard
              label="Regulator Access"
              value={data.compliance.regulator_access_events_recent}
              readiness="PARTIAL"
              source={src("overview.compliance.regulator_access_events_recent")}
            />
            <MetricCard
              label="Compliance Checks"
              value={data.compliance.compliance_checks_recent}
              readiness="PARTIAL"
              source={src("overview.compliance.compliance_checks_recent")}
            />
          </div>
        )}
        {tab === "exchange" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard
              label="Monetization Events"
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
              warning="No live pricing in P0"
              source={src("overview.exchange.cohort_pricing_status")}
            />
          </div>
        )}
        {tab === "agents" && (
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
              label="COSMP / DBGI"
              value={data.agents.cosmp_dbgi_telemetry_status}
              readiness="FUTURE"
              source={src("overview.agents.cosmp_dbgi_telemetry_status")}
            />
          </div>
        )}
        {tab === "reports" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <MetricCard
              label="Total"
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
        )}
      </section>

      {/* E. Recent Activity */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          <Link to="/console/governance/audit" className="text-[11px] text-primary hover:underline">
            Open Audit Center →
          </Link>
        </div>
        <ol className="flex flex-col divide-y divide-border rounded-md border border-border bg-surface">
          {auditData?.items.slice(0, 8).map((e) => (
            <li
              key={e.audit_id}
              className="flex flex-wrap items-center gap-3 px-3 py-2 text-[11px]"
            >
              <span className="mono shrink-0 text-muted-foreground">
                {new Date(e.created_at).toISOString().slice(11, 19)}
              </span>
              <span className="text-foreground">{e.event_type}</span>
              <StatusPill
                tone={e.outcome === "success" ? "ok" : e.outcome === "denied" ? "warn" : "danger"}
              >
                {e.outcome}
              </StatusPill>
              <span className="mono truncate text-muted-foreground">{e.route ?? "—"}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* F. Reports Panel */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Reports</h2>
          <Link to="/console/reports" className="text-[11px] text-primary hover:underline">
            Open Report Catalog →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {reportsData?.reports.slice(0, 8).map((r) => (
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
        </div>
      </section>

      {/* Program status details — internal build posture (secondary, de-jargoned from hero) */}
      <Accordion title="Program status details — internal build posture">
        <div className="flex flex-wrap gap-1.5">
          <StatusPill tone="neutral">env: {data.foundation.environment}</StatusPill>
          <StatusPill tone="neutral">
            commit: <span className="mono ml-1">{data.foundation.commit}</span>
          </StatusPill>
          <StatusPill tone={data.foundation.ci_status === "success" ? "ok" : "warn"}>
            CI: {data.foundation.ci_status}
          </StatusPill>
          <StatusPill tone="info">Mock Adapter</StatusPill>
          <StatusPill tone="neutral">Backend contract: landed</StatusPill>
          <StatusPill tone="ok">GOVSEC.5: {data.foundation.govsec5_status}</StatusPill>
          <StatusPill tone="warn">GAP-O7: {data.foundation.gap_o7_status}</StatusPill>
          <StatusPill tone="neutral">GOVSEC.7: {data.foundation.govsec7_status}</StatusPill>
          <StatusPill tone="info">Console: {data.foundation.console1_status}</StatusPill>
          <StatusPill tone="neutral">Read-only P0 Console surface</StatusPill>
        </div>
      </Accordion>

      <DemoGuidePanel open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

/* Local home card that routes the viewer logically and shows its layer. */
function PrimaryCard({
  title,
  blurb,
  layer,
  to,
}: {
  title: string;
  blurb: string;
  layer: ConsoleLayer;
  to: string;
}) {
  return (
    <a
      href={to}
      className="flex h-full min-w-0 flex-col gap-2 overflow-hidden rounded-md border border-border bg-card p-4 hover:border-border-strong"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <LayerBadge layer={layer} />
      </div>
      <p className="text-[12px] leading-relaxed text-muted-foreground">{blurb}</p>
      <span className="mt-auto text-[11px] text-primary">Open →</span>
    </a>
  );
}
