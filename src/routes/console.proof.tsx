import { createFileRoute, Link } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/proof")({
  head: () => ({ meta: [{ title: "Regulator Proof Surfaces — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Regulator / Proof Surface Center"
        subtitle="Scoped proof surfaces for regulator and auditor disclosure."
        readiness="FUTURE"
      />
      <ScopeBoundaryBanner tone="warn">
        Regulator proof surfaces are scoped and future, not full Console access. Regulators and
        auditors are Foundation-supported actors served through scoped proof/compliance portals
        rather than substrate-wide Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <DomainReadinessCard
          title="Disclosure Bundles"
          description="Scoped, signed proof bundles for regulator review. Not implemented in P0."
          readiness="FUTURE"
        />
        <DomainReadinessCard
          title="Auditor Read Channel"
          description="Audit-chain-backed read channel for credentialed auditors. Future."
          readiness="FUTURE"
        />
        <DomainReadinessCard
          title="Lawful-Basis Index"
          description="Index of lawful-basis events available for scoped disclosure. Partial backing."
          readiness="PARTIAL"
        />
        <DomainReadinessCard
          title="Government Proof Portal"
          description="Scoped institutional proof surfaces for public-sector entities. Future."
          readiness="FUTURE"
        />
      </div>
      <Link
        to="/console/reports/$report_id"
        params={{ report_id: "regulator_proof" }}
        className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
      >
        Open Regulator Proof Surface Report →
      </Link>
    </div>
  ),
});
