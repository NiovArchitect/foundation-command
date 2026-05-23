import type {
  ConsoleAuditEvent,
  ConsoleAuditQuery,
  ConsoleBreakGlassGrantRow,
  ConsoleBreakGlassQuery,
  ConsoleDataSource,
  ConsoleEntityQuery,
  ConsoleEntityRow,
  ConsoleEscalationQuery,
  ConsoleEscalationRow,
  ConsoleOverviewResponse,
  ConsolePaginated,
  ConsolePriority,
  ConsoleReadinessBadge,
  ConsoleReport,
  ConsoleReportSummary,
  ConsoleSecurityClass,
} from "@/types/console";

// USE_MOCK is owned by the Console config (defaults to true) and re-exported
// here for backward compatibility with any existing imports.
export { USE_MOCK } from "@/api/consoleConfig";

const now = () => new Date().toISOString();
const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const uuid = (s: string) => {
  // deterministic, uuid-shaped
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const hex = h.toString(16).padStart(8, "0");
  return `${hex}-0000-4000-8000-${hex}${hex.slice(0, 4)}`;
};

const hash = (s: string) => {
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < s.length; i++) {
    h ^= BigInt(s.charCodeAt(i));
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return "0x" + h.toString(16).padStart(16, "0") + h.toString(16).padStart(16, "0");
};

// ---------------- overview ----------------
const buildOverview = (): ConsoleOverviewResponse => ({
  ok: true,
  foundation: {
    environment: "production",
    commit: "a1b2c3d4e5",
    ci_status: "success",
    govsec5_status: "CLOSED",
    adr_0049_status: "Proposed",
    gap_o7_status: "OPEN",
    govsec7_status: "NOT_STARTED",
    console1_status: "P0_BACKEND",
    open_critical_gaps: 2,
    readiness: "PARTIAL",
  },
  health: {
    api: "ok",
    database: "ok",
    redis: "ok",
    cosmp: "unknown",
    dbgi: "unknown",
    readiness: "PARTIAL",
  },
  governance: {
    open_escalations: 4,
    pending_dual_control: 2,
    break_glass_active: 1,
    break_glass_used: 7,
    break_glass_reviewed: 5,
    recent_audit_events: 1248,
    recent_rate_limited_events: 18,
    readiness: "PARTIAL",
  },
  entities: {
    total_entities: 5471,
    by_type: {
      individual: 3120,
      employee: 1284,
      organization: 412,
      student: 380,
      educator: 142,
      agent: 88,
      device: 45,
    },
    total_orgs: 412,
    active_twins: 962,
    active_sessions: 178,
    readiness: "PARTIAL",
  },
  capsules: {
    total_capsules: 18402,
    recent_capsule_events: 642,
    readiness: "PARTIAL",
  },
  gateway: {
    operation_classes: ["read", "write", "share", "admin", "external_api"],
    live_counters_available: false,
    recent_anomalies: 3,
    readiness: "PARTIAL",
  },
  compliance: {
    lawful_basis_events_recent: 214,
    regulator_access_events_recent: 6,
    compliance_checks_recent: 87,
    readiness: "PARTIAL",
  },
  exchange: {
    monetization_events_recent: 0,
    market_surface_status: "PARTIAL",
    cohort_pricing_status: "FUTURE",
    readiness: "PARTIAL",
  },
  agents: {
    feedback_loops: 12,
    hive_surface_status: "PARTIAL",
    cosmp_dbgi_telemetry_status: "FUTURE",
    readiness: "PARTIAL",
  },
  reports: {
    total_reports: 18,
    live_ready: 1,
    partial: 15,
    mock_only: 1,
    future: 1,
  },
  generated_at: now(),
});

// ---------------- audit ----------------
const EVENT_TYPES = [
  "ADMIN_ACTION",
  "CAPSULE_READ",
  "CAPSULE_WRITE",
  "CAPSULE_SHARE",
  "SESSION_START",
  "SESSION_END",
  "BREAK_GLASS_INVOKE",
  "BREAK_GLASS_USE",
  "BREAK_GLASS_REVIEW",
  "ESCALATION_OPEN",
  "ESCALATION_APPROVE",
  "ESCALATION_REJECT",
  "RATE_LIMIT_TRIGGERED",
  "POLICY_DECISION",
  "REGULATOR_ACCESS",
];
const OUTCOMES = ["success", "denied", "error"];
const ROUTES = [
  "/api/v1/console/overview",
  "/api/v1/console/audit",
  "/api/v1/console/entities",
  "/api/v1/console/break-glass/grants",
  "/api/v1/console/escalations",
  "/api/v1/console/reports",
  "/api/v1/capsules",
  "/api/v1/wallets",
];

const AUDIT: ConsoleAuditEvent[] = Array.from({ length: 220 }, (_, i) => {
  const et = EVENT_TYPES[i % EVENT_TYPES.length];
  const outcome = OUTCOMES[i % OUTCOMES.length];
  const route = ROUTES[i % ROUTES.length];
  return {
    audit_id: uuid(`audit-${i}`),
    event_type: et,
    actor_entity_id: i % 11 === 0 ? null : uuid(`actor-${i % 40}`),
    target_entity_id: i % 7 === 0 ? null : uuid(`target-${i % 60}`),
    outcome,
    route,
    details:
      et === "ADMIN_ACTION"
        ? { action: "CONSOLE_READ", surface: route }
        : { method: i % 2 ? "GET" : "POST" },
    chain_hash: hash(`audit-${i}`),
    created_at: iso(-i * 11 * 60 * 1000),
  };
});

// ---------------- entities ----------------
const ENTITY_TYPES = [
  "individual",
  "employee",
  "organization",
  "student",
  "educator",
  "agent",
  "device",
  "institution",
];
const STATUSES = ["active", "suspended", "pending", "archived"];
const CLEARANCE = ["PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"];

const ENTITIES: ConsoleEntityRow[] = Array.from({ length: 180 }, (_, i) => {
  const et = ENTITY_TYPES[i % ENTITY_TYPES.length];
  return {
    entity_id: uuid(`entity-${i}`),
    entity_type: et,
    status: STATUSES[i % STATUSES.length],
    display_name:
      et === "organization"
        ? `Org Node ${i}`
        : et === "agent"
          ? `Agent-${i}`
          : et === "device"
            ? `Device-${i}`
            : `Entity ${i}`,
    wallet_id: i % 13 === 0 ? null : uuid(`wallet-${i}`),
    wallet_type: i % 13 === 0 ? null : i % 2 ? "custodial" : "self",
    active_sessions: i % 9,
    capabilities: {
      can_login: true,
      can_read_capsules: i % 3 !== 0,
      can_write_capsules: i % 4 === 0,
      can_share_capsules: i % 5 === 0,
      can_create_hives: i % 17 === 0,
      can_access_external_api: i % 11 === 0,
      can_admin_niov: i % 50 === 0,
      can_admin_org: et === "organization",
    },
    clearance_ceiling: CLEARANCE[i % CLEARANCE.length],
    created_at: iso(-i * 6 * HOUR),
  };
});

// ---------------- break-glass ----------------
const BG_ACTIONS = [
  "READ_CAPSULE_OVERRIDE",
  "DECRYPT_OVERRIDE",
  "POLICY_OVERRIDE",
  "ACCESS_RESET",
];
const BG_STATUSES = ["active", "used", "expired", "reviewed", "revoked"];

const GRANTS: ConsoleBreakGlassGrantRow[] = Array.from({ length: 42 }, (_, i) => {
  const status = BG_STATUSES[i % BG_STATUSES.length];
  return {
    grant_id: uuid(`bg-${i}`),
    source_entity_id: uuid(`actor-${i % 40}`),
    action_type: BG_ACTIONS[i % BG_ACTIONS.length],
    status,
    valid_from: iso(-i * DAY),
    valid_until: iso(-i * DAY + 4 * HOUR),
    used_at: status === "used" || status === "reviewed" ? iso(-i * DAY + 1 * HOUR) : null,
    reviewed_at: status === "reviewed" ? iso(-i * DAY + 5 * HOUR) : null,
    reviewed_by_entity_id: status === "reviewed" ? uuid(`reviewer-${i}`) : null,
    invoke_audit_id: uuid(`audit-inv-${i}`),
    use_audit_id: status !== "active" ? uuid(`audit-use-${i}`) : null,
    review_audit_id: status === "reviewed" ? uuid(`audit-rev-${i}`) : null,
    created_at: iso(-i * DAY),
  };
});

// ---------------- escalations ----------------
const ESC_STATUSES = ["pending", "approved", "rejected", "expired"];
const ESC_ACTIONS = ["WRITE_CAPSULE", "SHARE_CAPSULE", "GRANT_ROLE", "REVOKE_ROLE"];
const ESCALATIONS: ConsoleEscalationRow[] = Array.from({ length: 36 }, (_, i) => {
  const status = ESC_STATUSES[i % ESC_STATUSES.length];
  return {
    escalation_id: uuid(`esc-${i}`),
    source_entity_id: uuid(`actor-${i % 30}`),
    target_entity_id: i % 5 === 0 ? null : uuid(`target-${i}`),
    action_type: ESC_ACTIONS[i % ESC_ACTIONS.length],
    status,
    reason:
      i % 4 === 0
        ? "Dual-control required by policy"
        : i % 4 === 1
          ? "Cross-org capability"
          : i % 4 === 2
            ? "Restricted clearance ceiling"
            : "External API quota",
    created_at: iso(-i * 8 * HOUR),
    updated_at: iso(-i * 8 * HOUR + 30 * 60 * 1000),
    expires_at: iso(-i * 8 * HOUR + 24 * HOUR),
    approved_by_entity_id: status === "approved" ? uuid(`reviewer-${i}`) : null,
    rejected_by_entity_id: status === "rejected" ? uuid(`reviewer-${i}`) : null,
  };
});

// ---------------- reports ----------------
const src = (
  kind: ConsoleDataSource["kind"],
  ref: string,
  existing = true,
): ConsoleDataSource => ({ kind, ref, existing });

const disabledExports = [
  { format: "csv" as const, enabled: false },
  { format: "json" as const, enabled: false },
  { format: "pdf" as const, enabled: false },
];

const REPORT_DEFS: Array<{
  id: string;
  name: string;
  audience: ConsoleSecurityClass;
  readiness: ConsoleReadinessBadge;
  priority: ConsolePriority;
  purpose: string;
  sources: ConsoleDataSource[];
}> = [
  {
    id: "foundation_health",
    name: "Foundation Health Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P0",
    purpose: "Substrate-wide health snapshot across API, database, redis, COSMP, DBGI.",
    sources: [src("route", "GET /api/v1/console/overview")],
  },
  {
    id: "governance_audit",
    name: "Governance & Audit Report",
    audience: "NIOV_ONLY",
    readiness: "LIVE",
    priority: "P0",
    purpose: "Audited events across substrate with chain hash integrity.",
    sources: [src("route", "GET /api/v1/console/audit")],
  },
  {
    id: "break_glass",
    name: "Break-Glass Activity Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P0",
    purpose: "Break-glass grant lifecycle, usage, and review state.",
    sources: [src("route", "GET /api/v1/console/break-glass/grants")],
  },
  {
    id: "dual_control",
    name: "Dual-Control / Escalation Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P0",
    purpose: "Pending and resolved dual-control escalations.",
    sources: [src("route", "GET /api/v1/console/escalations")],
  },
  {
    id: "wallet_entity_growth",
    name: "Wallet & Entity Growth Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Entity and wallet creation trends across actor types.",
    sources: [src("route", "GET /api/v1/console/entities")],
  },
  {
    id: "capsule_movement",
    name: "Memory Capsule Movement Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Capsule lifecycle metadata events. No raw content displayed.",
    sources: [src("event", "capsule.*"), src("model", "CapsuleEvent")],
  },
  {
    id: "permission_revocation",
    name: "Permission / Revocation Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Capability grants and revocations across entities.",
    sources: [src("event", "permission.*")],
  },
  {
    id: "gateway_ratelimit",
    name: "Gateway / Rate-Limit Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Rate-limit posture per operation class. Live counters not yet available.",
    sources: [src("service", "Gateway"), src("event", "rate_limit.*")],
  },
  {
    id: "regulator_proof",
    name: "Regulator Proof Surface Report",
    audience: "REGULATOR_PROOF",
    readiness: "FUTURE",
    priority: "P2",
    purpose: "Scoped proof artifacts for regulator and auditor disclosure surfaces.",
    sources: [src("proposed", "ProofSurface", false)],
  },
  {
    id: "monetization_exchange",
    name: "Monetization / Intelligence Exchange Report",
    audience: "NIOV_ONLY",
    readiness: "MOCK",
    priority: "P2",
    purpose: "Permissioned intelligence exchange volume and posture. Pricing is mocked/future.",
    sources: [src("proposed", "ExchangeLedger", false)],
  },
  {
    id: "developer_api_usage",
    name: "Developer / API Usage Report",
    audience: "DEVELOPER_SCOPED",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Developer-scoped API usage, scoped to developer portal surface.",
    sources: [src("service", "Gateway")],
  },
  {
    id: "agent_hive_swarm",
    name: "Agent / Hive / Swarm Operations Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Agent, hive, and swarm coordination readiness. COSMP/DBGI telemetry is FUTURE.",
    sources: [src("service", "AgentMesh"), src("proposed", "COSMP/DBGI", false)],
  },
  {
    id: "org_activity",
    name: "Enterprise / Organization Activity Report",
    audience: "ORG_SCOPED",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Org-scoped activity rollups for enterprise admins.",
    sources: [src("route", "GET /api/v1/console/entities")],
  },
  {
    id: "compliance_export",
    name: "Compliance Export Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Export readiness for compliance disclosures. Export disabled in P0.",
    sources: [src("event", "compliance.*")],
  },
  {
    id: "capability_least_privilege",
    name: "Capability / Least-Privilege Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Capability distribution and least-privilege posture across entities.",
    sources: [src("route", "GET /api/v1/console/entities")],
  },
  {
    id: "security_anomaly",
    name: "Security / Anomaly Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Anomaly detections from audit and gateway signals.",
    sources: [src("event", "anomaly.*")],
  },
  {
    id: "session_access",
    name: "Session / Access Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P1",
    purpose: "Active sessions and access posture across substrate.",
    sources: [src("model", "Session")],
  },
  {
    id: "audit_chain_integrity",
    name: "Audit Chain Integrity Report",
    audience: "NIOV_ONLY",
    readiness: "PARTIAL",
    priority: "P0",
    purpose: "Hash-chain integrity verification of audit events.",
    sources: [src("model", "AuditEvent")],
  },
];

const REPORTS: ConsoleReportSummary[] = REPORT_DEFS.map((r) => ({
  report_id: r.id,
  display_name: r.name,
  route_slug: `/console/reports/${r.id}`,
  primary_audience: r.audience,
  purpose: r.purpose,
  readiness: r.readiness,
  priority: r.priority,
  sources: r.sources,
  export_options: disabledExports,
  mock_mode: true,
}));

const reportBody = (s: ConsoleReportSummary): ConsoleReport => {
  const points = Array.from({ length: 12 }, (_, i) => ({
    t: iso(-(11 - i) * DAY),
    v: Math.round(50 + Math.sin(i / 2) * 30 + i * 4),
  }));
  return {
    report_id: s.report_id,
    display_name: s.display_name,
    route_slug: s.route_slug,
    audience: s.primary_audience,
    purpose: s.purpose,
    readiness: s.readiness,
    priority: s.priority,
    security: s.primary_audience,
    sections: [
      {
        id: "summary",
        title: "Summary",
        cards: [
          {
            id: "primary",
            label: "Primary signal",
            value: 128,
            readiness: s.readiness,
            source: s.sources[0],
          },
          {
            id: "secondary",
            label: "Secondary signal",
            value: 42,
            readiness: s.readiness,
            source: s.sources[0],
            warning: s.readiness === "MOCK" ? "Mock value only" : undefined,
          },
          {
            id: "tertiary",
            label: "Open items",
            value: 6,
            readiness: s.readiness,
            source: s.sources[0],
          },
        ],
      },
      {
        id: "trend",
        title: "Trend",
        charts: [
          {
            id: "trend-line",
            kind: "line",
            series: [{ label: "Volume", points }],
            readiness: s.readiness,
            source: s.sources[0],
          },
        ],
      },
      {
        id: "recent",
        title: "Recent activity",
        tables: [
          {
            id: "recent-table",
            columns: [
              { id: "ts", label: "Timestamp" },
              { id: "ref", label: "Reference" },
              { id: "outcome", label: "Outcome" },
            ],
            rows: Array.from({ length: 8 }, (_, i) => ({
              ts: iso(-i * HOUR),
              ref: uuid(`${s.report_id}-row-${i}`),
              outcome: i % 3 === 0 ? "denied" : "success",
            })),
            paginated: false,
            total: 8,
            readiness: s.readiness,
            source: s.sources[0],
          },
        ],
        empty_state: "No recent activity in window.",
        warning_state:
          s.readiness === "FUTURE" || s.readiness === "MOCK"
            ? "This surface is not production-backed."
            : undefined,
        drilldown:
          s.report_id === "governance_audit"
            ? [{ label: "Open Audit Center", href: "/console/governance/audit" }]
            : s.report_id === "break_glass"
              ? [{ label: "Open Break-Glass Center", href: "/console/governance/break-glass" }]
              : s.report_id === "dual_control"
                ? [{ label: "Open Escalations", href: "/console/governance/escalations" }]
                : s.report_id === "wallet_entity_growth"
                  ? [{ label: "Open Wallets & Entities", href: "/console/entities" }]
                  : undefined,
      },
    ],
    filters: [
      { id: "range", label: "Date range", type: "date-range" },
      { id: "outcome", label: "Outcome", type: "enum", options: ["success", "denied", "error"] },
    ],
    exports: [
      { format: "csv", enabled: false, security: s.primary_audience },
      { format: "json", enabled: false, security: s.primary_audience },
      { format: "pdf", enabled: false, security: s.primary_audience },
    ],
    sources: s.sources,
    last_refreshed: now(),
    data_freshness_seconds: 30,
    auditable: true,
    mock_mode: true,
  };
};

// ---------------- adapter ----------------
const delay = <T>(v: T): Promise<T> => new Promise((r) => setTimeout(() => r(v), 80));

const paginate = <T>(items: T[], skip = 0, take = 25): ConsolePaginated<T> => {
  const slice = items.slice(skip, skip + take);
  return {
    ok: true,
    items: slice,
    total: items.length,
    skip,
    take,
    has_more: skip + take < items.length,
    generated_at: now(),
  };
};

export const mockConsoleApi = {
  async getOverview(): Promise<ConsoleOverviewResponse> {
    return delay(buildOverview());
  },

  async getAudit(q: ConsoleAuditQuery = {}): Promise<ConsolePaginated<ConsoleAuditEvent>> {
    let items = AUDIT;
    if (q.event_type) items = items.filter((x) => x.event_type === q.event_type);
    if (q.outcome) items = items.filter((x) => x.outcome === q.outcome);
    if (q.actor_entity_id) items = items.filter((x) => x.actor_entity_id === q.actor_entity_id);
    if (q.target_entity_id) items = items.filter((x) => x.target_entity_id === q.target_entity_id);
    if (q.from) items = items.filter((x) => x.created_at >= q.from!);
    if (q.to) items = items.filter((x) => x.created_at <= q.to!);
    return delay(paginate(items, q.skip ?? 0, q.take ?? 25));
  },

  async getEntities(q: ConsoleEntityQuery = {}): Promise<ConsolePaginated<ConsoleEntityRow>> {
    let items = ENTITIES;
    if (q.entity_type) items = items.filter((x) => x.entity_type === q.entity_type);
    if (q.status) items = items.filter((x) => x.status === q.status);
    if (q.q) {
      const needle = q.q.toLowerCase();
      items = items.filter(
        (x) =>
          x.entity_id.includes(needle) ||
          (x.display_name ?? "").toLowerCase().includes(needle),
      );
    }
    return delay(paginate(items, q.skip ?? 0, q.take ?? 25));
  },

  async getBreakGlassGrants(
    q: ConsoleBreakGlassQuery = {},
  ): Promise<ConsolePaginated<ConsoleBreakGlassGrantRow>> {
    let items = GRANTS;
    if (q.status) items = items.filter((x) => x.status === q.status);
    if (q.action_type) items = items.filter((x) => x.action_type === q.action_type);
    if (q.source_entity_id) items = items.filter((x) => x.source_entity_id === q.source_entity_id);
    return delay(paginate(items, q.skip ?? 0, q.take ?? 25));
  },

  async getEscalations(
    q: ConsoleEscalationQuery = {},
  ): Promise<ConsolePaginated<ConsoleEscalationRow>> {
    let items = ESCALATIONS;
    if (q.status) items = items.filter((x) => x.status === q.status);
    if (q.action_type) items = items.filter((x) => x.action_type === q.action_type);
    if (q.source_entity_id) items = items.filter((x) => x.source_entity_id === q.source_entity_id);
    return delay(paginate(items, q.skip ?? 0, q.take ?? 25));
  },

  async getReports(): Promise<{
    ok: true;
    reports: ConsoleReportSummary[];
    total: number;
    generated_at: string;
  }> {
    return delay({ ok: true, reports: REPORTS, total: REPORTS.length, generated_at: now() });
  },

  async getReportById(
    report_id: string,
  ): Promise<
    | { ok: true; report: ConsoleReport; generated_at: string }
    | { ok: false; code: "REPORT_NOT_FOUND" }
  > {
    const summary = REPORTS.find((r) => r.report_id === report_id);
    if (!summary) return delay({ ok: false as const, code: "REPORT_NOT_FOUND" as const });
    return delay({ ok: true as const, report: reportBody(summary), generated_at: now() });
  },
};
