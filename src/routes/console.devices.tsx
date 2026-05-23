import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/devices")({
  head: () => ({ meta: [{ title: "Devices / Robotics — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Device / Robotics / Agentic Systems View" subtitle="Devices, robotics, and AI agents as Foundation-supported entities." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Devices, robotics systems, AI agents, and automated systems are Foundation-supported
        entities governed through wallets, scopes, policies, and event surfaces. They are not human
        Console users.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainReadinessCard title="Device Wallets" description="Per-device wallet identity and scopes." readiness="FUTURE" />
        <DomainReadinessCard title="Robotics Policies" description="Policy posture for robotics systems." readiness="FUTURE" />
        <DomainReadinessCard title="Agent Scopes" description="Scoped capability assignment for AI agents." readiness="FUTURE" />
        <DomainReadinessCard title="Event Surfaces" description="Event ingest from automated systems." readiness="FUTURE" />
      </div>
    </div>
  ),
});
