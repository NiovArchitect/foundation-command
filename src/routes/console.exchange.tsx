import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import { MetricCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/exchange")({
  head: () => ({ meta: [{ title: "Intelligence Exchange — NIOV Foundation Console" }] }),
  component: () => {
    const { data } = useOverview();
    const e = data?.exchange;
    return (
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Permissioned Intelligence Exchange"
          subtitle="Cohort-based exchange posture. No live pricing surface in P0."
          readiness="MOCK"
          generatedAt={data?.generated_at}
        />
        <ScopeBoundaryBanner tone="warn">
          Market pricing is mocked/future and must not be treated as live.
        </ScopeBoundaryBanner>
        {e && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <MetricCard label="Monetization Events (recent)" value={e.monetization_events_recent} readiness="MOCK" source={{ kind: "route", ref: "overview.exchange.monetization_events_recent", existing: true }} />
            <MetricCard label="Market Surface" value={e.market_surface_status} readiness="PARTIAL" source={{ kind: "route", ref: "overview.exchange.market_surface_status", existing: true }} />
            <MetricCard label="Cohort Pricing" value={e.cohort_pricing_status} readiness="FUTURE" source={{ kind: "route", ref: "overview.exchange.cohort_pricing_status", existing: true }} />
          </div>
        )}
        <Link to="/console/reports/$report_id" params={{ report_id: "monetization_exchange" }} className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2">
          Open Monetization / Intelligence Exchange Report →
        </Link>
      </div>
    );
  },
});
