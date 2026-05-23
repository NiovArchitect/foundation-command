import * as React from "react";
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
  SourceMappingAccordion,
  SourceMappingBadge,
  Sparkline,
  StatusPill,
  Tabs,
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
  const [tab, setTab] = React.useState<"summary" | "metrics" | "tables" | "timeline" | "sources">(
    "summary",
  );

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
  const metricSections = r.sections.filter((s) => s.cards?.length || s.charts?.length);
  const tableSections = r.sections.filter((s) => s.tables?.length);
  const timelineSections = r.sections.filter((s) => s.timelines?.length);

  return (
    <div className="flex flex-col gap-4">
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
      </div>

      <Tabs
        tabs={[
          { id: "summary", label: "Summary" },
          { id: "metrics", label: "Metrics", count: metricSections.length },
          { id: "tables", label: "Tables", count: tableSections.length },
          { id: "timeline", label: "Timeline", count: timelineSections.length },
          { id: "sources", label: "Source Mapping", count: r.sources.length },
        ]}
        active={tab}
        onChange={(id) => setTab(id as typeof tab)}
      />

      {tab === "summary" && (
        <div className="flex flex-col gap-3">
          <div className="rounded-md border border-border bg-surface p-4 text-[12px] text-muted-foreground">
            {r.purpose}
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
            <div
              key={sec.id}
              className="rounded-md border border-border bg-surface p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[12px] font-semibold text-foreground">{sec.title}</h3>
                <ReadinessBadge value={r.readiness} />
              </div>
              {sec.warning_state && (
                <div className="mt-2"><WarningState message={sec.warning_state} /></div>
              )}
              <div className="mt-1 text-[11px] text-muted-foreground">
                {sec.cards?.length ? `${sec.cards.length} metric(s) · ` : ""}
                {sec.charts?.length ? `${sec.charts.length} chart(s) · ` : ""}
                {sec.tables?.length ? `${sec.tables.length} table(s) · ` : ""}
                {sec.timelines?.length ? `${sec.timelines.length} timeline(s)` : ""}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "metrics" && (
        <div className="flex flex-col gap-4">
          {metricSections.length === 0 && <EmptyState message="No metric sections." />}
          {metricSections.map((sec) => (
            <section key={sec.id} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
              <h2 className="text-sm font-semibold text-foreground">{sec.title}</h2>
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
            </section>
          ))}
        </div>
      )}

      {tab === "tables" && (
        <div className="flex flex-col gap-4">
          {tableSections.length === 0 && <EmptyState message="No table sections." />}
          {tableSections.map((sec) => (
            <section key={sec.id} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
              <h2 className="text-sm font-semibold text-foreground">{sec.title}</h2>
              {sec.tables?.map((tbl) => (
                <Table key={tbl.id}>
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
              ))}
            </section>
          ))}
        </div>
      )}

      {tab === "timeline" && (
        <div className="flex flex-col gap-4">
          {timelineSections.length === 0 && <EmptyState message="No timeline sections." />}
          {timelineSections.map((sec) => (
            <section key={sec.id} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
              <h2 className="text-sm font-semibold text-foreground">{sec.title}</h2>
              {sec.timelines?.map((tl) => (
                <ol key={tl.id} className="flex flex-col gap-1 border-l border-border pl-3">
                  {tl.events.map((ev, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground">
                      <span className="mono">{ev.ts}</span> · {ev.label}
                    </li>
                  ))}
                </ol>
              ))}
            </section>
          ))}
        </div>
      )}

      {tab === "sources" && (
        <SourceMappingAccordion
          entries={r.sources.map((s) => ({
            label: `${s.kind}${s.existing === false ? " (proposed)" : ""}`,
            value: s.ref,
            tone: s.existing === false ? "warn" : "neutral",
          }))}
        />
      )}

      <ScopeBoundaryBanner>
        Report exports are disabled in P0. The Console is read-only.
      </ScopeBoundaryBanner>
    </div>
  );
}
