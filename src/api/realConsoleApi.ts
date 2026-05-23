/**
 * Real read-only Console API client (scaffold, behind the mock flag).
 *
 * Mirrors the shape of `mockConsoleApi` so it can be swapped in by the
 * `consoleApi` selector once live wiring is approved. It is NOT used while
 * `USE_MOCK` is true (the default), so this file is dormant scaffolding.
 *
 * Safety boundaries (must be preserved):
 *  - Read-only: every call is an HTTP GET. No write verbs are issued.
 *  - No auth logic: it relies on the browser's authenticated session cookie
 *    (`credentials: "include"`); it never handles tokens, login, or grants.
 *  - No new backend surface: it only calls the seven landed read endpoints
 *    under `/api/v1/console/*`.
 */
import { CONSOLE_API_BASE_URL } from "@/api/consoleConfig";
import type { ConsoleApi } from "@/api/consoleApi";
import type {
  ConsoleAuditEvent,
  ConsoleAuditQuery,
  ConsoleBreakGlassGrantRow,
  ConsoleBreakGlassQuery,
  ConsoleEntityQuery,
  ConsoleEntityRow,
  ConsoleEscalationQuery,
  ConsoleEscalationRow,
  ConsoleOverviewResponse,
  ConsolePaginated,
  ConsoleReport,
  ConsoleReportSummary,
} from "@/types/console";

export class ConsoleApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ConsoleApiError";
  }
}

/** Serialize a flat query object into a URL search string (skips empty values). */
function toQuery(params: object = {}): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    sp.set(key, String(value));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Issue a read-only GET against the Console API and parse JSON. */
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${CONSOLE_API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new ConsoleApiError(res.status, `Console API ${res.status} for GET ${path}`);
  }
  return (await res.json()) as T;
}

export const realConsoleApi: ConsoleApi = {
  async getOverview(): Promise<ConsoleOverviewResponse> {
    return getJson<ConsoleOverviewResponse>("/overview");
  },

  async getAudit(q: ConsoleAuditQuery = {}): Promise<ConsolePaginated<ConsoleAuditEvent>> {
    return getJson<ConsolePaginated<ConsoleAuditEvent>>(`/audit${toQuery(q)}`);
  },

  async getEntities(q: ConsoleEntityQuery = {}): Promise<ConsolePaginated<ConsoleEntityRow>> {
    return getJson<ConsolePaginated<ConsoleEntityRow>>(`/entities${toQuery(q)}`);
  },

  async getBreakGlassGrants(
    q: ConsoleBreakGlassQuery = {},
  ): Promise<ConsolePaginated<ConsoleBreakGlassGrantRow>> {
    return getJson<ConsolePaginated<ConsoleBreakGlassGrantRow>>(`/break-glass/grants${toQuery(q)}`);
  },

  async getEscalations(
    q: ConsoleEscalationQuery = {},
  ): Promise<ConsolePaginated<ConsoleEscalationRow>> {
    return getJson<ConsolePaginated<ConsoleEscalationRow>>(`/escalations${toQuery(q)}`);
  },

  async getReports(): Promise<{
    ok: true;
    reports: ConsoleReportSummary[];
    total: number;
    generated_at: string;
  }> {
    return getJson<{
      ok: true;
      reports: ConsoleReportSummary[];
      total: number;
      generated_at: string;
    }>("/reports");
  },

  async getReportById(
    report_id: string,
  ): Promise<
    | { ok: true; report: ConsoleReport; generated_at: string }
    | { ok: false; code: "REPORT_NOT_FOUND" }
  > {
    const res = await fetch(`${CONSOLE_API_BASE_URL}/reports/${encodeURIComponent(report_id)}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) {
      return { ok: false as const, code: "REPORT_NOT_FOUND" as const };
    }
    if (!res.ok) {
      throw new ConsoleApiError(
        res.status,
        `Console API ${res.status} for GET /reports/${report_id}`,
      );
    }
    return (await res.json()) as { ok: true; report: ConsoleReport; generated_at: string };
  },
};
