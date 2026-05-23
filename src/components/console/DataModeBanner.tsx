import * as React from "react";
import { cn } from "@/lib/utils";
import { USE_MOCK, CONSOLE_API_BASE_URL } from "@/api/consoleConfig";
import { hasConsoleBearerToken } from "@/api/consoleAuth";

/**
 * Global data-mode banner shown across Console pages (rendered by the console
 * layout). Reads the build-time `USE_MOCK` flag, the configured API base URL,
 * and the in-memory token presence so an operator can always tell whether the
 * Console is serving MOCK data or talking to a LIVE backend.
 *
 * It never displays or logs the token and never touches web storage. Token
 * presence updates live via the `console-auth-change` window event dispatched
 * by the Live Backend Token Bridge.
 */
export function DataModeBanner() {
  const [tokenPresent, setTokenPresent] = React.useState(false);

  React.useEffect(() => {
    const read = () => setTokenPresent(hasConsoleBearerToken());
    read();
    if (typeof window === "undefined") return;
    window.addEventListener("console-auth-change", read);
    return () => window.removeEventListener("console-auth-change", read);
  }, []);

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

  const tone = tokenPresent
    ? "border-success/40 bg-success/10 text-success"
    : "border-warning/40 bg-warning/10 text-warning";
  const status = tokenPresent
    ? "Live mode active — Bearer token present in memory."
    : "Live mode selected — requests are blocked until a Bearer token is set.";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b px-4 py-1.5 text-[11px]",
        tone,
      )}
    >
      <span className="font-semibold uppercase tracking-wider">LIVE MODE</span>
      <span aria-hidden>·</span>
      <span>{status}</span>
      <span aria-hidden>·</span>
      <span className="mono">API base: {CONSOLE_API_BASE_URL}</span>
    </div>
  );
}
