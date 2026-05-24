import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  setConsoleBearerToken,
  clearConsoleBearerToken,
  verifyConsoleBearerToken,
  type ConsoleVerificationStatus,
} from "@/api/consoleAuth";
import { USE_MOCK } from "@/api/consoleConfig";
import { useConsoleAuth } from "@/hooks/useConsoleAuth";
import { CommandCenterSection, StatusPill, WarningState } from "@/components/console";

/**
 * P0 / dev-only operator bridge for placing a `can_admin_niov` Bearer token into
 * the in-memory token holder so the browser live smoke can authenticate.
 *
 * This is NOT a production login system: it never captures credentials, never
 * calls an auth endpoint, and never persists the token. The raw token is handed
 * straight to `setConsoleBearerToken` and the field is cleared — the component
 * keeps no copy of it and never displays or imports it back.
 *
 * Crucially, a pasted token is NOT treated as live-ready on presence alone: in
 * live mode it is verified against the backend (safe GET /overview) and the UI
 * reflects the real verification result, so a random token visibly fails.
 */
type StatusView = { text: string; tone: "ok" | "warn" | "danger" | "info" | "neutral" };

function verificationView(v: ConsoleVerificationStatus, httpStatus?: number): StatusView {
  switch (v) {
    case "mock_mode":
      return { text: "Mock mode — backend token verification is not used.", tone: "info" };
    case "token_missing":
      return { text: "Token missing — live Console requests are blocked.", tone: "warn" };
    case "token_present_unverified":
      return { text: "Token present — not verified yet.", tone: "warn" };
    case "verifying":
      return { text: "Verifying token with backend…", tone: "info" };
    case "verified":
      return { text: "Backend verified — live reads enabled.", tone: "ok" };
    case "rejected":
      return {
        text: `Token rejected${httpStatus ? ` (${httpStatus})` : ""} — paste a valid can_admin_niov token.`,
        tone: "danger",
      };
    case "unreachable":
      return { text: "Backend unreachable — check API base / server.", tone: "danger" };
    case "failed_unknown":
      return {
        text: `Verification failed${httpStatus ? ` (${httpStatus})` : ""}.`,
        tone: "danger",
      };
  }
}

export function LiveBackendConnectionPanel() {
  const queryClient = useQueryClient();
  const auth = useConsoleAuth();
  const [value, setValue] = React.useState("");

  const handleSet = async () => {
    const trimmed = value.trim();
    setConsoleBearerToken(value);
    // A new token must not show data fetched under the old token / mock source.
    queryClient.removeQueries({ queryKey: ["console"] });
    setValue(""); // never retain the raw token in component state
    if (!USE_MOCK && trimmed !== "") {
      const result = await verifyConsoleBearerToken();
      if (result === "verified") {
        // Refetch Console data under the now-verified token.
        queryClient.invalidateQueries({ queryKey: ["console"] });
      }
    }
  };

  const handleClear = () => {
    clearConsoleBearerToken();
    // Fail closed: drop all cached Console data so nothing stale stays visible.
    queryClient.removeQueries({ queryKey: ["console"] });
  };

  const status = verificationView(auth.verification, auth.httpStatus);

  return (
    <CommandCenterSection
      title="P0 Live Backend Token Bridge"
      description="Dev/P0-only operator bridge for a memory-only Bearer token."
      readiness="FUTURE"
    >
      <div className="flex flex-col gap-3">
        <WarningState message="Live backend mode requires a can_admin_niov Bearer token." />
        <WarningState message="This is not a production login system." />

        <ul className="flex list-disc flex-col gap-1 pl-5 text-[12px] text-muted-foreground">
          <li>The token is stored in memory only and clears on reload.</li>
          <li>Changing the token clears cached Console query data.</li>
          <li>A pasted token is verified against the backend; presence alone is not success.</li>
          <li>Token verification only matters in LIVE MODE.</li>
          <li>Mock mode remains the default unless VITE_CONSOLE_USE_MOCK=false is set.</li>
          <li>
            To run live locally, start the dev server with VITE_CONSOLE_USE_MOCK=false and
            VITE_CONSOLE_API_BASE_URL set to the backend origin.
          </li>
          <li>Do not use production tokens in local smoke testing.</li>
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste can_admin_niov Bearer token"
            autoComplete="off"
            spellCheck={false}
            aria-label="Operator Bearer token"
            className="w-72 rounded-sm border border-border bg-surface-2 px-2 py-1 text-[12px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          <button
            type="button"
            onClick={handleSet}
            disabled={value.trim() === "" || auth.verification === "verifying"}
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-2 disabled:opacity-40"
          >
            {auth.verification === "verifying" ? "Verifying…" : "Set token"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-2"
          >
            Clear token
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="neutral">
            {auth.tokenPresent ? "Token set: ••••••••••••" : "No token set"}
          </StatusPill>
          <StatusPill tone={status.tone}>{status.text}</StatusPill>
        </div>
      </div>
    </CommandCenterSection>
  );
}
