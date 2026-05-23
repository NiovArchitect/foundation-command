import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { GLOSSARY } from "@/lib/glossary";
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
    <section className="overflow-hidden rounded-md border border-border bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="break-words text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 break-words text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
        {readiness && <ReadinessBadge className="shrink-0" value={readiness} />}
      </header>
      {banner}
      <div className="min-w-0 p-4">{children}</div>
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
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-semibold text-foreground">{title}</h3>
        <ReadinessBadge className="shrink-0" value={readiness} />
      </div>
      <p className="break-words text-[12px] leading-relaxed text-muted-foreground">{description}</p>
      {capabilities && capabilities.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {capabilities.map((c) => (
            <li
              key={c}
              className="break-words rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground"
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

/* ---------------- Tabs (lightweight) ---------------- */
export type TabItem = { id: string; label: string; count?: number | string };
export function Tabs({
  tabs,
  active,
  onChange,
  right,
  size = "md",
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  right?: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border">
      <div className="flex flex-wrap gap-0.5">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "relative -mb-px border-b-2 px-3 py-2 text-[12px] font-medium",
                size === "sm" && "px-2 py-1.5 text-[11px]",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1.5 rounded-sm bg-surface-2 px-1 py-0.5 text-[10px] text-muted-foreground">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {right && <div className="pb-2">{right}</div>}
    </div>
  );
}

/* ---------------- HelpTooltip ---------------- */
export function HelpTooltip({ term, label }: { term: string; label?: string }) {
  const tip = GLOSSARY[term] ?? term;
  return (
    <span
      tabIndex={0}
      title={tip}
      aria-label={`${term}: ${tip}`}
      className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-border bg-surface-2 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
    >
      {label ?? "?"}
    </span>
  );
}

/* ---------------- CopyableId ---------------- */
export function CopyableId({
  value,
  className,
  width = "max-w-[180px]",
}: {
  value: string | null | undefined;
  className?: string;
  width?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  if (!value) return <span className="mono text-muted-foreground">—</span>;
  const v = String(value);
  const short = v.length > 16 ? `${v.slice(0, 8)}…${v.slice(-4)}` : v;
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(v);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      title={`${v} — click to copy`}
      className={cn(
        "mono inline-flex items-center gap-1 truncate rounded-sm border border-transparent px-1 py-0 text-[11px] text-foreground hover:border-border hover:bg-surface-2",
        width,
        className,
      )}
    >
      <span className="truncate">{short}</span>
      <span className="text-[9px] text-muted-foreground">{copied ? "✓" : "⧉"}</span>
    </button>
  );
}

/* ---------------- ClampText ---------------- */
export function ClampText({
  children,
  lines = 3,
  className,
}: {
  children: React.ReactNode;
  lines?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className={cn("text-[12px] leading-relaxed text-muted-foreground", className)}>
      <div
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 text-[11px] text-primary hover:underline"
      >
        {expanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
}

/* ---------------- ScrollBox ---------------- */
export function ScrollBox({
  children,
  maxHeight = 240,
  copyValue,
}: {
  children: React.ReactNode;
  maxHeight?: number;
  copyValue?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative rounded-sm border border-border bg-surface-2">
      {copyValue && (
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(copyValue);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            } catch {}
          }}
          className="absolute right-1 top-1 z-10 rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
      <pre className="mono overflow-auto p-2 text-[11px]" style={{ maxHeight }}>
        {children}
      </pre>
    </div>
  );
}

/* ---------------- Accordion ---------------- */
export function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] font-medium text-foreground hover:bg-surface-2"
      >
        <span className="min-w-0 break-words">{title}</span>
        <span className="shrink-0 text-[11px] text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-border p-3 text-[12px] text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------------- SourceMappingAccordion ---------------- */
export function SourceMappingAccordion({
  entries,
}: {
  entries: { label: string; value: string; tone?: "neutral" | "warn" }[];
}) {
  return (
    <Accordion title="Source mapping & contract notes">
      <div className="flex flex-col gap-1.5">
        {entries.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[140px_1fr] gap-3 border-b border-border pb-1.5 last:border-0"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {e.label}
            </div>
            <div
              className={cn(
                "mono text-[11px]",
                e.tone === "warn" ? "text-warning" : "text-foreground",
              )}
            >
              {e.value}
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  );
}

/* ---------------- PageGuide ---------------- */
export function PageGuide({ inspect, excluded }: { inspect?: string; excluded?: string }) {
  if (!inspect && !excluded) return null;
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {inspect && (
        <div className="rounded-md border border-info/30 bg-info/5 p-3 text-[12px]">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-info">
            What to inspect first
          </div>
          <p className="leading-relaxed text-muted-foreground">{inspect}</p>
        </div>
      )}
      {excluded && (
        <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-[12px]">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
            Intentionally excluded
          </div>
          <p className="leading-relaxed text-muted-foreground">{excluded}</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- FoundationPlaneCard ---------------- */
export function FoundationPlaneCard({
  title,
  description,
  readiness,
  links,
}: {
  title: string;
  description: string;
  readiness: ConsoleReadinessBadge;
  links: { label: string; to: string }[];
}) {
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ReadinessBadge value={readiness} />
      </div>
      <p className="text-[12px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-sm border border-border bg-surface px-2 py-1 text-[11px] text-foreground hover:bg-surface-2"
          >
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------- DomainCard (ecosystem) ---------------- */
export function DomainCard({
  title,
  audience,
  actorTypes,
  readiness,
  entityCount,
  openIssues,
  to,
  entitiesHref,
  boundary,
}: {
  title: string;
  audience: string;
  actorTypes: string[];
  readiness: ConsoleReadinessBadge;
  entityCount: number | string;
  openIssues?: number;
  to: string;
  entitiesHref?: string;
  boundary?: string;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ReadinessBadge value={readiness} />
      </div>
      <p className="text-[11px] text-muted-foreground">
        <span className="uppercase tracking-wider text-foreground/70">Serves:</span> {audience}
      </p>
      <div className="flex flex-wrap gap-1">
        {actorTypes.map((a) => (
          <span
            key={a}
            className="rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {a}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-sm border border-border bg-surface px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Mock entities
          </div>
          <div className="mono text-foreground">{entityCount}</div>
        </div>
        <div className="rounded-sm border border-border bg-surface px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Open issues
          </div>
          <div
            className={cn(
              "mono",
              (openIssues ?? 0) > 0 ? "text-warning" : "text-foreground",
            )}
          >
            {openIssues ?? 0}
          </div>
        </div>
      </div>
      {boundary && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">{boundary}</p>
      )}
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        <Link
          to={to}
          className="rounded-sm border border-border bg-surface px-2 py-1 text-[11px] text-foreground hover:bg-surface-2"
        >
          View readiness →
        </Link>
        {entitiesHref && (
          <a
            href={entitiesHref}
            className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-foreground hover:bg-accent/40"
          >
            View entities →
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------- CriticalAttentionQueue ---------------- */
export function CriticalAttentionQueue({
  items,
}: {
  items: {
    severity: "info" | "warn" | "critical";
    label: string;
    href?: string;
    source?: string;
  }[];
}) {
  if (items.length === 0) {
    return <EmptyState message="No critical operator action required in mock P0 state." />;
  }
  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center gap-3 px-3 py-2">
          <span
            className={cn(
              "inline-flex h-2 w-2 shrink-0 rounded-full",
              it.severity === "critical"
                ? "bg-danger"
                : it.severity === "warn"
                  ? "bg-warning"
                  : "bg-info",
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-foreground">{it.label}</div>
            {it.source && (
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {it.source}
              </div>
            )}
          </div>
          {it.href && (
            <a
              href={it.href}
              className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-foreground hover:bg-accent/40"
            >
              Inspect →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- DemoGuidePanel ---------------- */
const DEMO_STEPS: { label: string; href: string; note: string }[] = [
  {
    label: "Foundation status",
    href: "/console",
    note: "Start at Command Center; review hero + readiness.",
  },
  {
    label: "Critical attention queue",
    href: "/console",
    note: "Triage open escalations, active break-glass, anomalies.",
  },
  {
    label: "Foundation planes",
    href: "/console",
    note: "Memory / Permission / Governance / Execution / Integration.",
  },
  {
    label: "Entity Registry",
    href: "/console/entities",
    note: "Central object layer; filter by domain.",
  },
  {
    label: "Entity drawer",
    href: "/console/entities",
    note: "Inspect entity wallet, capabilities, sessions.",
  },
  {
    label: "Audit Center",
    href: "/console/governance/audit",
    note: "Hash-chained governance events.",
  },
  {
    label: "Break-Glass",
    href: "/console/governance/break-glass",
    note: "Grant metadata only; justification excluded.",
  },
  {
    label: "Report catalog",
    href: "/console/reports",
    note: "Eighteen reports across readiness tiers.",
  },
  {
    label: "Intelligence Exchange",
    href: "/console/exchange",
    note: "MOCK / FUTURE — no live pricing.",
  },
  {
    label: "Proof surfaces",
    href: "/console/proof",
    note: "Scoped, not full Console access.",
  },
  {
    label: "Ecosystem overview",
    href: "/console/ecosystem",
    note: "Foundation-supported actor domains.",
  },
  {
    label: "Console access",
    href: "/console/access",
    note: "can_admin_niov today; ConsoleOperatorRole future.",
  },
];

export function DemoGuidePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-background/60 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Demo Guide</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Twelve-step walkthrough of the Foundation Console.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </header>
        <ol className="flex-1 overflow-y-auto p-5">
          {DEMO_STEPS.map((s, i) => (
            <li key={i} className="mb-3 border-l-2 border-border pl-3">
              <div className="flex items-center gap-2">
                <span className="mono inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-surface-2 text-[10px] text-foreground">
                  {i + 1}
                </span>
                <a
                  href={s.href}
                  className="text-[12px] font-medium text-foreground hover:underline"
                >
                  {s.label}
                </a>
              </div>
              <p className="ml-7 mt-0.5 text-[11px] text-muted-foreground">{s.note}</p>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

/* ---------------- EcosystemDomainPage (shared 5-tab pattern) ---------------- */
export function EcosystemDomainPage({
  title,
  subtitle,
  readiness,
  scopeBoundary,
  entityType,
  reports,
  overview,
  boundariesExtra,
  sourceMappingEntries,
}: {
  title: string;
  subtitle: string;
  readiness: ConsoleReadinessBadge;
  scopeBoundary: string;
  entityType?: string;
  reports: { id: string; label: string; readiness: ConsoleReadinessBadge }[];
  overview: React.ReactNode;
  boundariesExtra?: React.ReactNode;
  sourceMappingEntries: { label: string; value: string; tone?: "neutral" | "warn" }[];
}) {
  const [tab, setTab] = React.useState("overview");
  const entitiesHref = entityType
    ? `/console/entities?type=${encodeURIComponent(entityType)}`
    : "/console/entities";
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} subtitle={subtitle} readiness={readiness} />
      <div className="flex flex-wrap gap-1.5">
        <StatusPill tone="neutral">
          Access: <span className="mono">can_admin_niov</span>
        </StatusPill>
        <StatusPill tone="info">Mock Adapter</StatusPill>
        <StatusPill tone="neutral">Writes: Disabled</StatusPill>
      </div>
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "entities", label: "Entities" },
          { id: "reports", label: "Reports", count: reports.length },
          { id: "boundaries", label: "Boundaries" },
          { id: "sources", label: "Source Mapping" },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === "overview" && <div className="flex flex-col gap-4">{overview}</div>}
      {tab === "entities" && (
        <div className="flex flex-col gap-3">
          <div className="rounded-md border border-border bg-surface px-3 py-2 text-[12px] text-muted-foreground">
            Entities for this domain live in the Foundation Entity Registry. The registry is the
            canonical place to inspect individual entity metadata.
          </div>
          <a
            href={entitiesHref}
            className="self-start rounded-sm border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground hover:bg-accent/40"
          >
            View entities filtered by{" "}
            <span className="mono">{entityType ?? "this domain"}</span> →
          </a>
        </div>
      )}
      {tab === "reports" && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {reports.map((r) => (
            <Link
              key={r.id}
              to="/console/reports/$report_id"
              params={{ report_id: r.id }}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 hover:bg-surface-2"
            >
              <span className="text-[12px] text-foreground">{r.label}</span>
              <ReadinessBadge value={r.readiness} />
            </Link>
          ))}
        </div>
      )}
      {tab === "boundaries" && (
        <div className="flex flex-col gap-3">
          <ScopeBoundaryBanner>{scopeBoundary}</ScopeBoundaryBanner>
          {boundariesExtra}
          <div className="rounded-md border border-border bg-surface p-3 text-[12px] text-muted-foreground">
            End users in this domain receive application-side, portal-side, or scoped experiences
            — not substrate-wide Console access. Substrate-wide Console access requires{" "}
            <span className="mono">can_admin_niov</span>.
          </div>
        </div>
      )}
      {tab === "sources" && <SourceMappingAccordion entries={sourceMappingEntries} />}
    </div>
  );
}

