import * as React from "react";
import { cn } from "@/lib/utils";
import type {
  ConsoleDataSource,
  ConsoleReadinessBadge,
  ConsoleSecurityClass,
} from "@/types/console";

/* ---------------- ReadinessBadge ---------------- */
export function ReadinessBadge({ value, className }: { value: ConsoleReadinessBadge; className?: string }) {
  const map: Record<ConsoleReadinessBadge, string> = {
    LIVE: "bg-success/15 text-success border-success/30",
    PARTIAL: "bg-warning/15 text-warning border-warning/30",
    MOCK: "bg-info/15 text-info border-info/30",
    FUTURE: "bg-muted text-muted-foreground border-border-strong",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        map[value],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

/* ---------------- StatusPill ---------------- */
export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "ok" | "warn" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const map = {
    ok: "bg-success/15 text-success border-success/30",
    warn: "bg-warning/15 text-warning border-warning/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    info: "bg-info/15 text-info border-info/30",
    neutral: "bg-surface-2 text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium",
        map[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- RiskBadge ---------------- */
export function RiskBadge({ level }: { level: "low" | "med" | "high" | "critical" }) {
  const tone =
    level === "low" ? "ok" : level === "med" ? "warn" : level === "high" ? "danger" : "danger";
  return (
    <StatusPill tone={tone as "ok" | "warn" | "danger"}>
      Risk: {level.toUpperCase()}
    </StatusPill>
  );
}

/* ---------------- SecurityClassBadge ---------------- */
export function SecurityClassBadge({ value }: { value: ConsoleSecurityClass }) {
  const label = value.replace("_", " ");
  const tone =
    value === "NIOV_ONLY"
      ? "info"
      : value === "ORG_SCOPED"
        ? "neutral"
        : value === "REGULATOR_PROOF"
          ? "warn"
          : "neutral";
  return <StatusPill tone={tone as "info" | "neutral" | "warn"}>{label}</StatusPill>;
}

/* ---------------- SourceMappingBadge ---------------- */
export function SourceMappingBadge({ source }: { source: ConsoleDataSource }) {
  return (
    <span className="mono inline-flex max-w-full flex-wrap items-center gap-1 break-all rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground">
      <span className="uppercase text-foreground/70">{source.kind}</span>
      <span>·</span>
      <span className="min-w-0 break-all">{source.ref}</span>
      {!source.existing && <span className="text-warning">· proposed</span>}
    </span>
  );
}

/* ---------------- MockDataBanner ---------------- */
export function MockDataBanner() {
  return (
    <div className="border-b border-border bg-info/10 px-4 py-1.5 text-[11px] text-info">
      <span className="font-medium">Backend contract landed;</span> frontend currently using mock
      adapter.
    </div>
  );
}

/* ---------------- DataFreshnessIndicator ---------------- */
export function DataFreshnessIndicator({ generatedAt }: { generatedAt?: string | null }) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const id = setInterval(force, 15_000);
    return () => clearInterval(id);
  }, []);
  if (!generatedAt) return null;
  const ms = Date.now() - new Date(generatedAt).getTime();
  const s = Math.max(0, Math.floor(ms / 1000));
  const label = s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
  return (
    <span className="mono inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      Refreshed {label}
    </span>
  );
}

/* ---------------- MetricCard ---------------- */
export function MetricCard({
  label,
  value,
  unit,
  readiness,
  source,
  warning,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  readiness?: ConsoleReadinessBadge;
  source?: ConsoleDataSource;
  warning?: string;
  hint?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 break-words text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {readiness && <ReadinessBadge className="shrink-0" value={readiness} />}
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">
        <div className="min-w-0 break-words text-2xl font-semibold tabular-nums text-foreground">
          {value === null || value === undefined ? "—" : value}
        </div>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className="break-words text-[11px] text-muted-foreground">{hint}</div>}
      {warning && <div className="break-words text-[11px] text-warning">{warning}</div>}
      {source && (
        <div className="min-w-0 overflow-hidden">
          <SourceMappingBadge source={source} />
        </div>
      )}
    </div>
  );
}

/* ---------------- CommandCenterSection ---------------- */
export function CommandCenterSection({
  title,
  description,
  readiness,
  children,
  banner,
}: {
  title: string;
  description?: string;
  readiness?: ConsoleReadinessBadge;
  children: React.ReactNode;
  banner?: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
        {readiness && <ReadinessBadge value={readiness} />}
      </header>
      {banner}
      <div className="p-4">{children}</div>
    </section>
  );
}

/* ---------------- EmptyState / WarningState ---------------- */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface px-4 py-6 text-center text-xs text-muted-foreground">
      {message}
    </div>
  );
}

export function WarningState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-[11px] text-warning">
      {message}
    </div>
  );
}

/* ---------------- ScopeBoundaryBanner ---------------- */
export function ScopeBoundaryBanner({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn";
  children: React.ReactNode;
}) {
  const cls =
    tone === "warn"
      ? "border-warning/40 bg-warning/10 text-warning"
      : "border-info/40 bg-info/10 text-info";
  return (
    <div className={cn("rounded-md border px-3 py-2 text-[12px] leading-relaxed", cls)}>
      {children}
    </div>
  );
}

/* ---------------- DisabledAction ---------------- */
export function DisabledAction({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled
      title="Read-only P0 Console surface."
      aria-disabled="true"
      className={cn(
        "cursor-not-allowed rounded-sm border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground opacity-70",
        className,
      )}
    >
      {label}
    </button>
  );
}

/* ---------------- PageHeader ---------------- */
export function PageHeader({
  title,
  subtitle,
  readiness,
  generatedAt,
  right,
}: {
  title: string;
  subtitle?: string;
  readiness?: ConsoleReadinessBadge;
  generatedAt?: string | null;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {readiness && <ReadinessBadge value={readiness} />}
        </div>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-[12px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {generatedAt !== undefined && <DataFreshnessIndicator generatedAt={generatedAt} />}
        {right}
      </div>
    </div>
  );
}

/* ---------------- FilterBar / SearchInput ---------------- */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-56 rounded-sm border border-border bg-surface-2 px-2 py-1 text-[12px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
    />
  );
}

export function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[12px] text-foreground outline-none focus:border-ring"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ---------------- DetailDrawer ---------------- */
export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-background/60 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-border bg-surface shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="mono mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}

/* ---------------- Table primitives ---------------- */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface">
      <table className="w-full border-collapse text-[12px]">{children}</table>
    </div>
  );
}
export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted-foreground">
      {children}
    </thead>
  );
}
export function TH({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-border px-3 py-2 text-left font-medium", className)}>
      {children}
    </th>
  );
}
export function TR({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border last:border-0",
        onClick && "cursor-pointer hover:bg-surface-2",
        selected && "bg-accent/40",
      )}
    >
      {children}
    </tr>
  );
}
export function TD({
  children,
  mono,
  className,
}: {
  children?: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td className={cn("px-3 py-2 align-top text-foreground", mono && "mono", className)}>
      {children}
    </td>
  );
}

/* ---------------- Pagination footer ---------------- */
export function PaginationFooter({
  skip,
  take,
  total,
  hasMore,
  onPrev,
  onNext,
}: {
  skip: number;
  take: number;
  total: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-surface-2 px-3 py-2 text-[11px] text-muted-foreground">
      <div className="mono">
        {total === 0 ? 0 : skip + 1}–{Math.min(skip + take, total)} of {total}
      </div>
      <div className="flex gap-1">
        <button
          onClick={onPrev}
          disabled={skip === 0}
          className="rounded-sm border border-border bg-surface px-2 py-0.5 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={!hasMore}
          className="rounded-sm border border-border bg-surface px-2 py-0.5 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------------- DomainReadinessCard ---------------- */
export function DomainReadinessCard({
  title,
  description,
  readiness,
  capabilities,
}: {
  title: string;
  description: string;
  readiness: ConsoleReadinessBadge;
  capabilities?: string[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ReadinessBadge value={readiness} />
      </div>
      <p className="text-[12px] leading-relaxed text-muted-foreground">{description}</p>
      {capabilities && capabilities.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {capabilities.map((c) => (
            <li
              key={c}
              className="rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Mini chart (svg sparkline) ---------------- */
export function Sparkline({ points }: { points: { t: string; v: number }[] }) {
  if (points.length === 0) return null;
  const max = Math.max(...points.map((p) => p.v));
  const min = Math.min(...points.map((p) => p.v));
  const range = max - min || 1;
  const w = 280;
  const h = 60;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p.v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
    </svg>
  );
}
