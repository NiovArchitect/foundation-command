import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/individuals")({
  head: () => ({ meta: [{ title: "Individuals — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Individuals / Wallet Domain View" subtitle="Foundation-supported individuals served through wallets and applications." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Individuals are Foundation-supported actors served through wallets, consent controls,
        memory experiences, and application-side products powered by the Foundation. They do not
        receive substrate-wide Foundation Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainReadinessCard title="Personal Wallets" description="Individual wallet and identity surfaces." readiness="FUTURE" />
        <DomainReadinessCard title="Consent Controls" description="Granular consent over capsules and sharing." readiness="FUTURE" />
        <DomainReadinessCard title="Memory Experiences" description="Application-side experiences on top of governed memory." readiness="FUTURE" />
        <DomainReadinessCard title="Revocation Surfaces" description="Revocation of permissions across scopes." readiness="FUTURE" />
      </div>
    </div>
  ),
});
