import * as React from "react";
import { useOverview } from "@/hooks/useConsole";
import { StatusPill } from "@/components/console";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data } = useOverview();
  const env = data?.foundation.environment ?? "—";
  const ci = data?.foundation.ci_status ?? "unknown";
  const readiness = data?.foundation.readiness ?? "PARTIAL";
  return (
    <header className="flex h-12 items-center justify-between gap-3 border-b border-border bg-surface px-4">
      <div className="flex min-w-0 items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>
        )}
        <div className="truncate text-sm font-semibold tracking-tight text-foreground">
          NIOV Foundation Console
        </div>
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <StatusPill tone="neutral">env: {env}</StatusPill>
          <StatusPill
            tone={ci === "success" ? "ok" : ci === "failed" ? "danger" : "neutral"}
          >
            CI: {ci}
          </StatusPill>
          <StatusPill tone={readiness === "PARTIAL" ? "warn" : "ok"}>
            Foundation: {readiness}
          </StatusPill>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
        <ThemeToggle />
        <span className="hidden rounded-sm border border-border bg-surface-2 px-2 py-0.5 lg:inline">
          Read-only P0 Console surface
        </span>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const opts: { id: ThemeMode; label: string }[] = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "system", label: "System" },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-sm border border-border bg-surface-2 p-0.5">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setMode(o.id)}
          className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${
            mode === o.id
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={`Theme: ${o.label}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
