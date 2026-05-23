import * as React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useReports } from "@/hooks/useConsole";
import {
  FilterBar,
  PageHeader,
  ReadinessBadge,
  ScopeBoundaryBanner,
  SecurityClassBadge,
  SelectFilter,
  SourceMappingBadge,
  StatusPill,
} from "@/components/console";

export const Route = createFileRoute("/console/reports")({
  head: () => ({ meta: [{ title: "Report Catalog — NIOV Foundation Console" }] }),
  component: ReportCatalog,
});

function ReportCatalog() {
  const { data } = useReports();
  const [readiness, setReadiness] = React.useState("");
  const [audience, setAudience] = React.useState("");
  const [priority, setPriority] = React.useState("");

  const filtered =
    data?.reports.filter(
      (r) =>
        (!readiness || r.readiness === readiness) &&
        (!audience || r.primary_audience === audience) &&
        (!priority || r.priority === priority),
    ) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Report Catalog"
        subtitle="Eighteen Foundation Console reports. Exports are disabled in P0."
        readiness="PARTIAL"
        generatedAt={data?.generated_at}
      />
      <FilterBar>
        <SelectFilter
          value={readiness}
          onChange={setReadiness}
          placeholder="Readiness"
          options={["LIVE", "PARTIAL", "MOCK", "FUTURE"]}
        />
        <SelectFilter
          value={audience}
          onChange={setAudience}
          placeholder="Audience"
          options={["NIOV_ONLY", "ORG_SCOPED", "REGULATOR_PROOF", "DEVELOPER_SCOPED"]}
        />
        <SelectFilter
          value={priority}
          onChange={setPriority}
          placeholder="Priority"
          options={["P0", "P1", "P2"]}
        />
        <div className="ml-auto text-[11px] text-muted-foreground">
          {filtered.length} of {data?.total ?? 0}
        </div>
      </FilterBar>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => (
          <Link
            key={r.report_id}
            to="/console/reports/$report_id"
            params={{ report_id: r.report_id }}
            className="group flex flex-col gap-3 rounded-md border border-border bg-card p-4 hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
                {r.display_name}
              </h3>
              <ReadinessBadge value={r.readiness} />
            </div>
            <p className="text-[12px] leading-relaxed text-muted-foreground">{r.purpose}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <SecurityClassBadge value={r.primary_audience} />
              <StatusPill tone="neutral">{r.priority}</StatusPill>
              {r.mock_mode && <StatusPill tone="info">mock_mode</StatusPill>}
            </div>
            <div className="flex flex-wrap gap-1">
              {r.sources.map((s, i) => (
                <SourceMappingBadge key={i} source={s} />
              ))}
            </div>
            <div className="flex gap-1.5 border-t border-border pt-2">
              {r.export_options.map((ex) => (
                <span
                  key={ex.format}
                  title="Read-only P0 Console surface."
                  className="cursor-not-allowed rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground opacity-70"
                >
                  {ex.format}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <ScopeBoundaryBanner>
        Reports may map to LIVE, PARTIAL, MOCK, or FUTURE backing. Exports remain disabled in P0
        across all reports.
      </ScopeBoundaryBanner>
    </div>
  );
}
