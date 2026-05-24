import { createFileRoute } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import { EcosystemDomainPage, MetricCard, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/exchange")({
  head: () => ({ meta: [{ title: "Intelligence Exchange — NIOV Foundation Console" }] }),
  component: () => {
    const { data } = useOverview();
    const e = data?.exchange;
    return (
      <EcosystemDomainPage
        breadcrumbGroup="Data, Proof & Intelligence"
        meaning={{
          layer: "Preview",
          body: "Permissioned, depersonalized, requester-facing intelligence exchange.",
          bullets: [
            "Not individual data sale — exchange is permissioned and depersonalized.",
            "No live pricing in P0; pricing is mocked / future.",
          ],
        }}
        title="Permissioned Intelligence Exchange"
        subtitle="Cohort-based exchange posture. No live pricing surface in P0."
        readiness="MOCK"
        scopeBoundary="Market pricing is mocked/future and must not be treated as live."
        reports={[
          {
            id: "monetization_exchange",
            label: "Monetization / Intelligence Exchange",
            readiness: "MOCK",
          },
        ]}
        overview={
          <>
            <ScopeBoundaryBanner tone="warn">
              Market pricing is mocked/future and must not be treated as live.
            </ScopeBoundaryBanner>
            {e && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <MetricCard
                  label="Monetization Events (recent)"
                  value={e.monetization_events_recent}
                  readiness="MOCK"
                  source={{
                    kind: "route",
                    ref: "overview.exchange.monetization_events_recent",
                    existing: true,
                  }}
                />
                <MetricCard
                  label="Market Surface"
                  value={e.market_surface_status}
                  readiness="PARTIAL"
                  source={{
                    kind: "route",
                    ref: "overview.exchange.market_surface_status",
                    existing: true,
                  }}
                />
                <MetricCard
                  label="Cohort Pricing"
                  value={e.cohort_pricing_status}
                  readiness="FUTURE"
                  source={{
                    kind: "route",
                    ref: "overview.exchange.cohort_pricing_status",
                    existing: true,
                  }}
                />
              </div>
            )}
          </>
        }
        sourceMappingEntries={[
          { label: "overview.exchange", value: "/api/v1/console/overview" },
          { label: "cohort pricing", value: "proposed (FUTURE)", tone: "warn" },
        ]}
      />
    );
  },
});
