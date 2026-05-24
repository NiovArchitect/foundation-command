/**
 * In-memory-only operator Bearer token holder + reactive verification store for
 * Console live mode.
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
 *
 * Token PRESENCE is not the same as live readiness. `verifyConsoleBearerToken`
 * probes the backend with a safe GET /overview read and records a verification
 * status, so the UI can distinguish "a string is in memory" from "the backend
 * accepted this token". This module is DOM-free, React-free, and storage-free;
 * reactivity is provided by a listener set.
 */
import { USE_MOCK, CONSOLE_API_BASE_URL } from "@/api/consoleConfig";

export type ConsoleVerificationStatus =
  | "mock_mode"
  | "token_missing"
  | "token_present_unverified"
  | "verifying"
  | "verified"
  | "rejected"
  | "unreachable"
  | "failed_unknown";

export interface ConsoleAuthSnapshot {
  tokenPresent: boolean;
  verification: ConsoleVerificationStatus;
  httpStatus?: number;
}

let consoleBearerToken: string | null = null;
let verification: ConsoleVerificationStatus = USE_MOCK ? "mock_mode" : "token_missing";
let httpStatus: number | undefined;

// Cached immutable snapshot so useSyncExternalStore gets a stable reference
// between notifications (avoids infinite re-render loops).
let snapshot: ConsoleAuthSnapshot = buildSnapshot();
const listeners = new Set<() => void>();

function buildSnapshot(): ConsoleAuthSnapshot {
  return {
    tokenPresent: consoleBearerToken !== null,
    verification,
    httpStatus,
  };
}

function notify(): void {
  snapshot = buildSnapshot();
  listeners.forEach((l) => l());
}

/** Subscribe to auth/verification state changes. Returns an unsubscribe fn. */
export function subscribeConsoleAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Current immutable auth snapshot (stable reference until the next change). */
export function getConsoleAuthSnapshot(): ConsoleAuthSnapshot {
  return snapshot;
}

/** Current operator Bearer token, or null when none is set. */
export function getConsoleBearerToken(): string | null {
  return consoleBearerToken;
}

/**
 * Set the in-memory operator Bearer token. Blank/whitespace input clears it.
 * Setting a token marks it present-but-unverified (live mode) — it is NOT
 * treated as verified until `verifyConsoleBearerToken` succeeds.
 */
export function setConsoleBearerToken(token: string): void {
  const trimmed = typeof token === "string" ? token.trim() : "";
  if (trimmed === "") {
    clearConsoleBearerToken();
    return;
  }
  consoleBearerToken = trimmed;
  verification = USE_MOCK ? "mock_mode" : "token_present_unverified";
  httpStatus = undefined;
  notify();
}

/** Clear the in-memory operator Bearer token and reset verification state. */
export function clearConsoleBearerToken(): void {
  consoleBearerToken = null;
  verification = USE_MOCK ? "mock_mode" : "token_missing";
  httpStatus = undefined;
  notify();
}

/**
 * Whether a non-empty operator Bearer token is currently in memory.
 * Retained for the real API client; the UI must NOT treat this as "verified".
 */
export function hasConsoleBearerToken(): boolean {
  return consoleBearerToken !== null;
}

/**
 * Probe the backend with a safe read (GET /overview, Bearer) and classify the
 * result into a verification status. No-op in mock mode. Uses its own minimal
 * fetch (no import of the real client) to avoid an import cycle.
 */
export async function verifyConsoleBearerToken(): Promise<ConsoleVerificationStatus> {
  if (USE_MOCK) {
    verification = "mock_mode";
    httpStatus = undefined;
    notify();
    return verification;
  }
  const token = consoleBearerToken;
  if (!token) {
    verification = "token_missing";
    httpStatus = undefined;
    notify();
    return verification;
  }

  verification = "verifying";
  httpStatus = undefined;
  notify();

  try {
    const res = await fetch(`${CONSOLE_API_BASE_URL}/overview`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      verification = "verified";
      httpStatus = undefined;
    } else if (res.status === 401 || res.status === 403) {
      verification = "rejected";
      httpStatus = res.status;
    } else {
      verification = "failed_unknown";
      httpStatus = res.status;
    }
  } catch {
    // Network / wrong base URL / CORS failure — no HTTP status available.
    verification = "unreachable";
    httpStatus = undefined;
  }
  notify();
  return verification;
}
