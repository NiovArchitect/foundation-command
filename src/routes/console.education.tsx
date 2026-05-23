import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/education")({
  head: () => ({ meta: [{ title: "Education Domain — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Education Domain View" subtitle="Education is a Foundation-supported domain, served through application-side surfaces." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Education is a Foundation-supported domain. Students and educators are served through
        application-side learning experiences, institution portals, learning wallets, classroom
        tools, credential capsules, and consent-governed memory experiences powered by the
        Foundation. They do not receive substrate-wide Foundation Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainReadinessCard title="Students" description="Learning wallets, portfolios, and consent-governed memory served via education apps." readiness="FUTURE" />
        <DomainReadinessCard title="Educators" description="Classroom tools, curriculum and credential workflows via educator surfaces." readiness="FUTURE" />
        <DomainReadinessCard title="Schools" description="Institution portals and scoped governance for schools." readiness="FUTURE" />
        <DomainReadinessCard title="Institutions" description="Accredited institution surfaces for credentials and compliance." readiness="FUTURE" />
        <DomainReadinessCard title="Guardians / Parents" description="Consent and oversight surfaces where applicable." readiness="FUTURE" />
        <DomainReadinessCard title="Accreditation / Compliance" description="Compliance and accreditation surfaces scoped to education." readiness="FUTURE" />
      </div>
    </div>
  ),
});
