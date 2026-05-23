import { createFileRoute, Link } from "@tanstack/react-router";
import { DisabledAction, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/compliance")({
  head: () => ({ meta: [{ title: "Compliance & Exports — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Compliance / Export Center"
        subtitle="Compliance disclosure surfaces. Exports are metadata only in P0."
        readiness="PARTIAL"
        right={
          <div className="flex gap-1">
            <DisabledAction label="Export CSV" />
            <DisabledAction label="Export JSON" />
            <DisabledAction label="Export PDF" />
          </div>
        }
      />
      <ScopeBoundaryBanner tone="warn">
        Export functionality is disabled in P0. The Console is read-only.
      </ScopeBoundaryBanner>
      <Link to="/console/reports/$report_id" params={{ report_id: "compliance_export" }} className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2">
        Open Compliance Export Report →
      </Link>
    </div>
  ),
});
