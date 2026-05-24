import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ConsoleBreadcrumbs,
  DisabledAction,
  PageHeader,
  PageMeaningPanel,
  ScopeBoundaryBanner,
} from "@/components/console";

export const Route = createFileRoute("/console/compliance")({
  head: () => ({ meta: [{ title: "Compliance & Exports — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <ConsoleBreadcrumbs
        items={[
          { label: "Console", to: "/console" },
          { label: "Reports & Compliance" },
          { label: "Compliance / Export Center" },
        ]}
      />
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
      <PageMeaningPanel
        layer="Report-backed"
        body="Report-backed P0 compliance / export surface."
        bullets={[
          "No actual export or write behavior in P0 — exports are disabled.",
          "Backed by the compliance_export report.",
        ]}
      />
      <ScopeBoundaryBanner tone="warn">
        Export functionality is disabled in P0. The Console is read-only.
      </ScopeBoundaryBanner>
      <div className="rounded-md border border-border bg-card p-4 text-[12px] leading-relaxed text-muted-foreground">
        <p>In P0, compliance is surfaced through report-backed read-only exports.</p>
        <p className="mt-2">
          The <span className="mono">compliance_export</span> report is the current canonical
          compliance export surface. This is a dedicated compliance entry point — not the generic
          Report Catalog, and not a broken redirect.
        </p>
      </div>
      <Link
        to="/console/reports/$report_id"
        params={{ report_id: "compliance_export" }}
        className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
      >
        Open Compliance Export Report →
      </Link>
    </div>
  ),
});
