/**
 * Console API selector.
 *
 * Resolves the read-only data source for the Console at module load. While
 * `USE_MOCK` is true (the default) this is the in-repo mock adapter, keeping
 * the app frontend-only with no real network calls. The real client is dormant
 * scaffolding for future wiring and is only selected when an operator opts into
 * live mode (`VITE_CONSOLE_USE_MOCK=false`).
 *
 * `ConsoleApi` is derived from the mock adapter so the real client is
 * structurally checked against the same read-only surface.
 */
import { USE_MOCK } from "@/api/consoleConfig";
import { mockConsoleApi } from "@/mock/mockConsoleApi";
import { realConsoleApi } from "@/api/realConsoleApi";

export type ConsoleApi = typeof mockConsoleApi;

export const consoleApi: ConsoleApi = USE_MOCK ? mockConsoleApi : realConsoleApi;
