import { createFileRoute } from "@tanstack/react-router";
import {
  ConsoleBreadcrumbs,
  DisabledAction,
  PageHeader,
  PageMeaningPanel,
  ScopeBoundaryBanner,
} from "@/components/console";
import { LiveBackendConnectionPanel } from "@/components/console/LiveBackendConnectionPanel";

export const Route = createFileRoute("/console/access")({
  head: () => ({ meta: [{ title: "Console Access — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <ConsoleBreadcrumbs
        items={[
          { label: "Console", to: "/console" },
          { label: "Governance" },
          { label: "Access Control" },
        ]}
      />
      <PageHeader
        title="Console Access / Operator Roles"
        subtitle="Operator role posture for the Foundation Console."
        readiness="FUTURE"
      />
      <PageMeaningPanel
        layer="Control-plane"
        body="Operator token bridge and future role model — not a production login system."
        bullets={[
          "P0 operator bridge for a memory-only Bearer token (see panel below).",
          "ConsoleOperatorRole is P1/future; current backend requires can_admin_niov.",
        ]}
      />
      <ScopeBoundaryBanner tone="warn">
        ConsoleOperatorRole is P1/future; current backend requires{" "}
        <span className="mono">can_admin_niov</span>.
      </ScopeBoundaryBanner>
      <div className="rounded-md border border-border bg-card p-4 text-[12px] text-muted-foreground">
        Role editing and permission editing are not enabled in P0. The Console is read-only.
        <div className="mt-3 flex gap-1">
          <DisabledAction label="Grant" />
          <DisabledAction label="Revoke" />
          <DisabledAction label="Invite" />
        </div>
      </div>
      <LiveBackendConnectionPanel />
      <ScopeBoundaryBanner>
        This panel is a P0 operator bridge, not a production login system.
      </ScopeBoundaryBanner>
    </div>
  ),
});
