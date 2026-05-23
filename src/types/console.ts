export type ConsoleReadinessBadge = "LIVE" | "PARTIAL" | "MOCK" | "FUTURE";
export type ConsolePriority = "P0" | "P1" | "P2";
export type ConsoleSecurityClass =
  | "NIOV_ONLY"
  | "ORG_SCOPED"
  | "REGULATOR_PROOF"
  | "DEVELOPER_SCOPED";

export interface ConsolePaginated<T> {
  ok: true;
  items: T[];
  total: number;
  skip: number;
  take: number;
  has_more: boolean;
  generated_at: string;
}

export interface ConsoleOverviewResponse {
  ok: true;
  foundation: {
    environment: string;
    commit: string | null;
    ci_status: "success" | "failed" | "unknown";
    govsec5_status: "CLOSED";
    adr_0049_status: "Proposed";
    gap_o7_status: "OPEN";
    govsec7_status: "NOT_STARTED";
    console1_status: "P0_BACKEND";
    open_critical_gaps: number;
    readiness: "PARTIAL";
  };
  health: {
    api: "ok" | "degraded" | "unknown";
    database: "ok" | "unknown";
    redis: "ok" | "unknown";
    cosmp: "ok" | "unknown";
    dbgi: "ok" | "unknown";
    readiness: "PARTIAL";
  };
  governance: {
    open_escalations: number;
    pending_dual_control: number;
    break_glass_active: number;
    break_glass_used: number;
    break_glass_reviewed: number;
    recent_audit_events: number;
    recent_rate_limited_events: number;
    readiness: "PARTIAL";
  };
  entities: {
    total_entities: number;
    by_type: Record<string, number>;
    total_orgs: number;
    active_twins: number;
    active_sessions: number | null;
    readiness: "PARTIAL";
  };
  capsules: {
    total_capsules: number;
    recent_capsule_events: number;
    readiness: "PARTIAL";
  };
  gateway: {
    operation_classes: string[];
    live_counters_available: false;
    recent_anomalies: number;
    readiness: "PARTIAL";
  };
  compliance: {
    lawful_basis_events_recent: number;
    regulator_access_events_recent: number;
    compliance_checks_recent: number;
    readiness: "PARTIAL";
  };
  exchange: {
    monetization_events_recent: number;
    market_surface_status: "PARTIAL";
    cohort_pricing_status: "FUTURE";
    readiness: "PARTIAL";
  };
  agents: {
    feedback_loops: number;
    hive_surface_status: "PARTIAL";
    cosmp_dbgi_telemetry_status: "FUTURE";
    readiness: "PARTIAL";
  };
  reports: {
    total_reports: number;
    live_ready: number;
    partial: number;
    mock_only: number;
    future: number;
  };
  generated_at: string;
}

export interface ConsoleAuditEvent {
  audit_id: string;
  event_type: string;
  actor_entity_id: string | null;
  target_entity_id: string | null;
  outcome: string;
  route: string | null;
  details: Record<string, unknown> | null;
  chain_hash: string;
  created_at: string;
}

export interface ConsoleEntityRow {
  entity_id: string;
  entity_type: string;
  status: string;
  display_name: string | null;
  wallet_id: string | null;
  wallet_type: string | null;
  active_sessions: number;
  capabilities: {
    can_login?: boolean;
    can_read_capsules?: boolean;
    can_write_capsules?: boolean;
    can_share_capsules?: boolean;
    can_create_hives?: boolean;
    can_access_external_api?: boolean;
    can_admin_niov?: boolean;
    can_admin_org?: boolean;
  } | null;
  clearance_ceiling: string | null;
  created_at: string;
}

export interface ConsoleBreakGlassGrantRow {
  grant_id: string;
  source_entity_id: string;
  action_type: string;
  status: string;
  valid_from: string;
  valid_until: string;
  used_at: string | null;
  reviewed_at: string | null;
  reviewed_by_entity_id: string | null;
  invoke_audit_id: string | null;
  use_audit_id: string | null;
  review_audit_id: string | null;
  created_at: string;
}

export interface ConsoleEscalationRow {
  escalation_id: string;
  source_entity_id: string;
  target_entity_id: string | null;
  action_type: string;
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  approved_by_entity_id: string | null;
  rejected_by_entity_id: string | null;
}

export interface ConsoleDataSource {
  kind: "route" | "service" | "model" | "event" | "static" | "proposed";
  ref: string;
  existing: boolean;
}

export interface ConsoleReportSummary {
  report_id: string;
  display_name: string;
  route_slug: string;
  primary_audience: ConsoleSecurityClass;
  purpose: string;
  readiness: ConsoleReadinessBadge;
  priority: ConsolePriority;
  sources: ConsoleDataSource[];
  export_options: { format: "csv" | "json" | "pdf"; enabled: boolean }[];
  mock_mode: boolean;
}

export interface ConsoleMetricCard {
  id: string;
  label: string;
  value: number | string | null;
  unit?: string;
  trend?: "up" | "down" | "flat";
  readiness: ConsoleReadinessBadge;
  source: ConsoleDataSource;
  warning?: string;
}

export interface ConsoleTable {
  id: string;
  columns: { id: string; label: string; sensitive?: boolean }[];
  rows: Record<string, unknown>[];
  paginated: boolean;
  total?: number;
  readiness: ConsoleReadinessBadge;
  source: ConsoleDataSource;
}

export interface ConsoleChart {
  id: string;
  kind: "line" | "bar" | "pie" | "area";
  series: { label: string; points: { t: string; v: number }[] }[];
  readiness: ConsoleReadinessBadge;
  source: ConsoleDataSource;
}

export interface ConsoleTimeline {
  id: string;
  events: {
    ts: string;
    label: string;
    severity?: "info" | "warn" | "critical";
    ref?: string;
  }[];
  readiness: ConsoleReadinessBadge;
  source: ConsoleDataSource;
}

export interface ConsoleExportOption {
  format: "csv" | "json" | "pdf";
  enabled: boolean;
  security: ConsoleSecurityClass;
}

export interface ConsoleReportFilter {
  id: string;
  label: string;
  type: "select" | "date-range" | "text" | "enum";
  options?: string[];
}

export interface ConsoleReportSection {
  id: string;
  title: string;
  cards?: ConsoleMetricCard[];
  tables?: ConsoleTable[];
  charts?: ConsoleChart[];
  timelines?: ConsoleTimeline[];
  empty_state?: string;
  warning_state?: string;
  drilldown?: { label: string; href: string }[];
}

export interface ConsoleReport {
  report_id: string;
  display_name: string;
  route_slug: string;
  audience: ConsoleSecurityClass;
  purpose: string;
  readiness: ConsoleReadinessBadge;
  priority: ConsolePriority;
  security: ConsoleSecurityClass;
  sections: ConsoleReportSection[];
  filters: ConsoleReportFilter[];
  exports: ConsoleExportOption[];
  sources: ConsoleDataSource[];
  last_refreshed: string | null;
  data_freshness_seconds?: number;
  auditable: boolean;
  mock_mode: boolean;
}

export interface ConsoleAuditQuery {
  skip?: number;
  take?: number;
  event_type?: string;
  actor_entity_id?: string;
  target_entity_id?: string;
  outcome?: string;
  from?: string;
  to?: string;
}

export interface ConsoleEntityQuery {
  skip?: number;
  take?: number;
  entity_type?: string;
  status?: string;
  q?: string;
}

export interface ConsoleBreakGlassQuery {
  skip?: number;
  take?: number;
  status?: string;
  action_type?: string;
  source_entity_id?: string;
}

export interface ConsoleEscalationQuery {
  skip?: number;
  take?: number;
  status?: string;
  source_entity_id?: string;
  action_type?: string;
}
