import { createFileRoute } from "@tanstack/react-router";
import { DisabledAction, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/access")({
  head: () => ({ meta: [{ title: "Console Access — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Console Access / Operator Roles" subtitle="Operator role posture for the Foundation Console." readiness="FUTURE" />
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
    </div>
  ),
});
