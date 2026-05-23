/**
 * Console data-source configuration.
 *
 * `USE_MOCK` gates whether the Console reads from the in-repo mock adapter or
 * the real read-only HTTP client. It defaults to TRUE: the Console stays
 * mock-first and frontend-only unless an operator explicitly opts into live
 * mode by setting `VITE_CONSOLE_USE_MOCK=false` at build time. Live mode is
 * never the default — only an exact "false" string flips it.
 */
const rawUseMockFlag = import.meta.env.VITE_CONSOLE_USE_MOCK as string | undefined;
export const USE_MOCK: boolean = rawUseMockFlag !== "false";

/**
 * Base path for the read-only Console API (`/api/v1/console/*`). Same-origin by
 * default; overridable via `VITE_CONSOLE_API_BASE_URL` for future wiring. Only
 * consulted when `USE_MOCK` is false.
 */
const rawBaseUrl = import.meta.env.VITE_CONSOLE_API_BASE_URL as string | undefined;
export const CONSOLE_API_BASE_URL: string = rawBaseUrl?.replace(/\/+$/, "") || "/api/v1/console";
