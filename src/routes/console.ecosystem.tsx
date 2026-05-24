import { createFileRoute } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import {
  ConsoleBreadcrumbs,
  DomainCard,
  PageHeader,
  PageMeaningPanel,
  ScopeBoundaryBanner,
} from "@/components/console";
import { entitiesHrefForType } from "@/lib/entityTypes";
import { ECOSYSTEM_DOMAIN_COPY } from "@/lib/ecosystemDomainCopy";

export const Route = createFileRoute("/console/ecosystem")({
  head: () => ({ meta: [{ title: "Ecosystem Overview — NIOV Foundation Console" }] }),
  component: EcosystemOverview,
});

function EcosystemOverview() {
  const { data } = useOverview();
  const byType = data?.entities.by_type ?? {};

  return (
    <div className="flex flex-col gap-5">
      <ConsoleBreadcrumbs
        items={[
          { label: "Console", to: "/console" },
          { label: "Entities & Ecosystem" },
          { label: "Ecosystem Overview" },
        ]}
      />
      <PageHeader
        title="Ecosystem Overview"
        subtitle="Foundation-supported actor domains. Each domain card explains who it serves, readiness, and the entity slice in the registry."
        readiness="PARTIAL"
        generatedAt={data?.generated_at}
      />
      <PageMeaningPanel
        layer={ECOSYSTEM_DOMAIN_COPY.ecosystem.layer}
        body={ECOSYSTEM_DOMAIN_COPY.ecosystem.whatItIs}
        bullets={[
          ECOSYSTEM_DOMAIN_COPY.ecosystem.whyItMatters,
          ECOSYSTEM_DOMAIN_COPY.ecosystem.foundationRelation,
          ECOSYSTEM_DOMAIN_COPY.ecosystem.otzarRelation,
        ]}
      />
      <ScopeBoundaryBanner>
        NIOV Foundation supports each domain below. The Console exposes operator-level metadata and
        readiness only. End users receive scoped application-side or portal-side experiences, not
        substrate-wide Console access.
      </ScopeBoundaryBanner>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainCard
          title="Organizations"
          audience="Enterprises and org admins running governed AI workflows."
          actorTypes={["organization", "org admin"]}
          readiness="PARTIAL"
          entityCount={byType.organization ?? 0}
          openIssues={0}
          to="/console/organizations"
          entitiesHref={entitiesHrefForType("organization")}
          boundary="Org users are served through scoped organization surfaces."
        />
        <DomainCard
          title="Education"
          audience="Students, educators, schools, institutions, guardians."
          actorTypes={["student", "educator", "institution"]}
          readiness="FUTURE"
          entityCount={(byType.student ?? 0) + (byType.educator ?? 0) + (byType.institution ?? 0)}
          openIssues={0}
          to="/console/education"
          entitiesHref={entitiesHrefForType("institution")}
          boundary="Served through application-side learning surfaces; Console sees institution-level metadata only."
        />
        <DomainCard
          title="Individuals"
          audience="Foundation-supported individuals with personal wallets."
          actorTypes={["individual"]}
          readiness="FUTURE"
          entityCount={byType.individual ?? 0}
          openIssues={0}
          to="/console/individuals"
          entitiesHref={entitiesHrefForType("individual")}
          boundary="Served through wallets and consent-governed memory experiences."
        />
        <DomainCard
          title="Employees"
          audience="Enterprise workforce served through AI teammates and org workflows."
          actorTypes={["employee"]}
          readiness="FUTURE"
          entityCount={byType.employee ?? 0}
          openIssues={0}
          to="/console/employees"
          entitiesHref={entitiesHrefForType("employee")}
          boundary="Served via enterprise applications, not Console."
        />
        <DomainCard
          title="Government / Public Sector"
          audience="Public-sector entities and credentialed institutions."
          actorTypes={["institution"]}
          readiness="FUTURE"
          entityCount={byType.institution ?? 0}
          openIssues={0}
          to="/console/governments"
          entitiesHref={entitiesHrefForType("institution")}
          boundary="Served via scoped institutional, compliance, and proof portals."
        />
        <DomainCard
          title="Developers"
          audience="Third-party developers integrating via APIs and SDKs."
          actorTypes={["developer"]}
          readiness="PARTIAL"
          entityCount={0}
          openIssues={0}
          to="/console/developer"
          entitiesHref={entitiesHrefForType()}
          boundary="Served through scoped developer portals, not Console."
        />
        <DomainCard
          title="Devices / Robotics"
          audience="Devices, robotics, and AI agents as Foundation-supported entities."
          actorTypes={["device", "agent"]}
          readiness="FUTURE"
          entityCount={(byType.device ?? 0) + (byType.agent ?? 0)}
          openIssues={0}
          to="/console/devices"
          entitiesHref={entitiesHrefForType("device")}
          boundary="Governed through wallets, scopes, and event surfaces."
        />
        <DomainCard
          title="Proof Surfaces"
          audience="Regulators and auditors via scoped proof channels."
          actorTypes={["regulator", "auditor"]}
          readiness="FUTURE"
          entityCount={0}
          openIssues={0}
          to="/console/proof"
          boundary="Scoped proof, not full Foundation Console access."
        />
        <DomainCard
          title="Permissioned Intelligence Exchange"
          audience="Cohort-based exchange of governed intelligence."
          actorTypes={["cohort"]}
          readiness="MOCK"
          entityCount={0}
          openIssues={1}
          to="/console/exchange"
          boundary="MOCK/FUTURE — no live market pricing surfaced."
        />
        <DomainCard
          title="Agent / Hive / Swarm Operations"
          audience="Agent coordination surfaces across the substrate."
          actorTypes={["agent", "hive", "swarm"]}
          readiness="PARTIAL"
          entityCount={byType.agent ?? 0}
          openIssues={1}
          to="/console/agents"
          entitiesHref={entitiesHrefForType("agent")}
          boundary="COSMP/DBGI telemetry remains FUTURE."
        />
      </div>
    </div>
  );
}
