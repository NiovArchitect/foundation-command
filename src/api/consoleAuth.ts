/**
 * In-memory-only operator Bearer token holder for Console live mode.
 *
 * The token lives ONLY in this module's memory for the life of the tab. It is
 * never written to localStorage, sessionStorage, cookies, IndexedDB, or the URL,
 * and it is lost on reload — an intentional P0 constraint that minimises the
 * blast radius of an admin (`can_admin_niov`) Bearer token.
 *
 * There is no login UI here and no call to `POST /api/v1/auth/login`: an
 * authorised operator injects a token they obtained out-of-band via
 * `setConsoleBearerToken`. The real Console API client reads it per request and
 * fails closed when it is absent.
 */
let consoleBearerToken: string | null = null;

/** Current operator Bearer token, or null when none is set. */
export function getConsoleBearerToken(): string | null {
  return consoleBearerToken;
}

/** Set the in-memory operator Bearer token. Blank/whitespace input clears it. */
export function setConsoleBearerToken(token: string): void {
  const trimmed = typeof token === "string" ? token.trim() : "";
  consoleBearerToken = trimmed === "" ? null : trimmed;
}

/** Clear the in-memory operator Bearer token. */
export function clearConsoleBearerToken(): void {
  consoleBearerToken = null;
}

/** Whether a non-empty operator Bearer token is currently set. */
export function hasConsoleBearerToken(): boolean {
  return consoleBearerToken !== null;
}
