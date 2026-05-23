import { Link, createFileRoute } from "@tanstack/react-router";
import { useReport } from "@/hooks/useConsole";
import {
  DisabledAction,
  EmptyState,
  MetricCard,
  PageHeader,
  ReadinessBadge,
  ScopeBoundaryBanner,
  SecurityClassBadge,
  SourceMappingBadge,
  Sparkline,
  StatusPill,
  Table,
  TD,
  TH,
  THead,
  TR,
  WarningState,
} from "@/components/console";

export const Route = createFileRoute("/console/reports/$report_id")({
  head: ({ params }) => ({
    meta: [{ title: `Report: ${params.report_id} — NIOV Foundation Console` }],
  }),
  component: ReportDetail,
});

function ReportDetail() {
  const { report_id } = Route.useParams();
  const { data, isLoading } = useReport(report_id);

  if (isLoading) {
    return <div className="text-xs text-muted-foreground">Loading report…</div>;
  }

  if (!data || !data.ok) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Report not found" readiness="FUTURE" />
        <EmptyState message={`No report exists with id "${report_id}".`} />
        <Link
          to="/console/reports"
          className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
        >
          ← Back to Report Catalog
        </Link>
      </div>
    );
  }

  const r = data.report;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={r.display_name}
        subtitle={r.purpose}
        readiness={r.readiness}
        generatedAt={r.last_refreshed}
        right={
          <div className="flex gap-1">
            {r.exports.map((ex) => (
              <DisabledAction key={ex.format} label={`Export ${ex.format.toUpperCase()}`} />
            ))}
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <SecurityClassBadge value={r.security} />
        <StatusPill tone="neutral">{r.priority}</StatusPill>
        {r.mock_mode && <StatusPill tone="info">mock_mode</StatusPill>}
        {r.data_freshness_seconds !== undefined && (
          <StatusPill tone="neutral">freshness: {r.data_freshness_seconds}s</StatusPill>
        )}
        {r.sources.map((s, i) => (
          <SourceMappingBadge key={i} source={s} />
        ))}
      </div>

      {r.filters.length > 0 && (
        <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
          <span className="mr-2 font-semibold uppercase tracking-wider">Filters:</span>
          {r.filters.map((f) => (
            <span
              key={f.id}
              className="mr-2 rounded-sm border border-border bg-surface-2 px-1.5 py-0.5"
            >
              {f.label} ({f.type})
            </span>
          ))}
          <span className="ml-2">Read-only in P0.</span>
        </div>
      )}

      {r.sections.map((sec) => (
        <section key={sec.id} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">{sec.title}</h2>
            <ReadinessBadge value={r.readiness} />
          </div>

          {sec.warning_state && <WarningState message={sec.warning_state} />}

          {sec.cards && sec.cards.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {sec.cards.map((c) => (
                <MetricCard
                  key={c.id}
                  label={c.label}
                  value={c.value as React.ReactNode}
                  unit={c.unit}
                  readiness={c.readiness}
                  source={c.source}
                  warning={c.warning}
                />
              ))}
            </div>
          )}

          {sec.charts?.map((ch) => (
            <div key={ch.id} className="rounded-md border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {ch.series[0]?.label ?? "Series"}
                </div>
                <SourceMappingBadge source={ch.source} />
              </div>
              <Sparkline points={ch.series[0]?.points ?? []} />
            </div>
          ))}

          {sec.tables?.map((tbl) => (
            <div key={tbl.id}>
              <Table>
                <THead>
                  <TR>
                    {tbl.columns.map((c) => (
                      <TH key={c.id}>{c.label}</TH>
                    ))}
                  </TR>
                </THead>
                <tbody>
                  {tbl.rows.length === 0 ? (
                    <TR>
                      <TD className="text-muted-foreground">No rows.</TD>
                    </TR>
                  ) : (
                    tbl.rows.map((row, i) => (
                      <TR key={i}>
                        {tbl.columns.map((c) => (
                          <TD key={c.id} mono>
                            {String(row[c.id] ?? "—")}
                          </TD>
                        ))}
                      </TR>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          ))}

          {sec.timelines?.map((tl) => (
            <ol key={tl.id} className="flex flex-col gap-1 border-l border-border pl-3">
              {tl.events.map((ev, i) => (
                <li key={i} className="text-[11px] text-muted-foreground">
                  <span className="mono">{ev.ts}</span> · {ev.label}
                </li>
              ))}
            </ol>
          ))}

          {sec.empty_state &&
            !(sec.cards?.length || sec.charts?.length || sec.tables?.length || sec.timelines?.length) && (
              <EmptyState message={sec.empty_state} />
            )}

          {sec.drilldown && sec.drilldown.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sec.drilldown.map((d) => (
                <Link
                  key={d.href}
                  to={d.href}
                  className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-[11px] text-foreground hover:bg-accent/40"
                >
                  {d.label} →
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}

      <ScopeBoundaryBanner>
        Report exports are disabled in P0. The Console is read-only.
      </ScopeBoundaryBanner>
    </div>
  );
}
