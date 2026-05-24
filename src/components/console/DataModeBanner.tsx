import { cn } from "@/lib/utils";
import { USE_MOCK, CONSOLE_API_BASE_URL } from "@/api/consoleConfig";
import { useConsoleAuth } from "@/hooks/useConsoleAuth";
import type { ConsoleVerificationStatus } from "@/api/consoleAuth";

/**
 * Global data-mode banner shown across Console pages (rendered by the console
 * layout). Reads the build-time `USE_MOCK` flag, the configured API base URL,
 * and the reactive auth/verification snapshot so an operator can always tell
 * whether the Console is serving MOCK data or talking to a verified LIVE backend.
 *
 * It never displays or logs the token and never touches web storage. Token
 * PRESENCE is never presented as live readiness — only a backend-verified token
 * shows a success state.
 */
function liveStatus(
  v: ConsoleVerificationStatus,
  httpStatus?: number,
): { text: string; tone: string } {
  switch (v) {
    case "verified":
      return {
        text: "Verified — live reads enabled.",
        tone: "border-success/40 bg-success/10 text-success",
      };
    case "verifying":
      return { text: "Verifying token…", tone: "border-info/40 bg-info/10 text-info" };
    case "token_present_unverified":
      return {
        text: "Token present — not yet verified.",
        tone: "border-warning/40 bg-warning/10 text-warning",
      };
    case "rejected":
      return {
        text: `Token rejected${httpStatus ? ` (${httpStatus})` : ""}.`,
        tone: "border-danger/40 bg-danger/10 text-danger",
      };
    case "unreachable":
      return {
        text: "Backend unreachable — check API base / server.",
        tone: "border-danger/40 bg-danger/10 text-danger",
      };
    case "failed_unknown":
      return {
        text: `Verification failed${httpStatus ? ` (${httpStatus})` : ""}.`,
        tone: "border-danger/40 bg-danger/10 text-danger",
      };
    case "mock_mode":
    case "token_missing":
    default:
      return {
        text: "Token missing — requests are blocked until a verified Bearer token is set.",
        tone: "border-warning/40 bg-warning/10 text-warning",
      };
  }
}

export function DataModeBanner() {
  const auth = useConsoleAuth();

  if (USE_MOCK) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-border bg-info/10 px-4 py-1.5 text-[11px] text-info">
        <span className="font-semibold uppercase tracking-wider">MOCK MODE</span>
        <span aria-hidden>·</span>
        <span>Mock mode active — no backend requests will be sent.</span>
        <span aria-hidden>·</span>
        <span className="text-muted-foreground">Default source is the in-repo mock adapter.</span>
      </div>
    );
  }

  const { text, tone } = liveStatus(auth.verification, auth.httpStatus);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b px-4 py-1.5 text-[11px]",
        tone,
      )}
    >
      <span className="font-semibold uppercase tracking-wider">LIVE MODE</span>
      <span aria-hidden>·</span>
      <span>{text}</span>
      <span aria-hidden>·</span>
      <span className="mono">API base: {CONSOLE_API_BASE_URL}</span>
    </div>
  );
}
