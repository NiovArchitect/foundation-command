import { useOverview } from "@/hooks/useConsole";
import { StatusPill } from "@/components/console";

export function TopBar() {
  const { data } = useOverview();
  const env = data?.foundation.environment ?? "—";
  const ci = data?.foundation.ci_status ?? "unknown";
  const readiness = data?.foundation.readiness ?? "PARTIAL";
  return (
    <header className="flex h-12 items-center justify-between gap-3 border-b border-border bg-surface px-4">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          NIOV Foundation Console
        </div>
        <StatusPill tone="neutral">env: {env}</StatusPill>
        <StatusPill tone={ci === "success" ? "ok" : ci === "failed" ? "danger" : "neutral"}>
          CI: {ci}
        </StatusPill>
        <StatusPill tone={readiness === "PARTIAL" ? "warn" : "ok"}>
          Foundation: {readiness}
        </StatusPill>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="rounded-sm border border-border bg-surface-2 px-2 py-0.5">
          Read-only P0 Console surface
        </span>
      </div>
    </header>
  );
}
