import { createFileRoute } from "@tanstack/react-router";
import { DisabledAction, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/settings")({
  head: () => ({ meta: [{ title: "Settings / Policy Registry — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Settings / Policy Registry" subtitle="Policy registry surface. Read-only in P0." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Policy editing is a write surface and is not enabled in P0. The Console is read-only.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-1 text-sm font-semibold text-foreground">Foundation Policies</div>
          <p className="text-[12px] text-muted-foreground">
            Substrate-level policy entries. Future surface.
          </p>
          <div className="mt-3 flex gap-1">
            <DisabledAction label="Save" />
            <DisabledAction label="Create" />
            <DisabledAction label="Delete" />
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-1 text-sm font-semibold text-foreground">Console Preferences</div>
          <p className="text-[12px] text-muted-foreground">
            Per-operator preferences. Read-only in P0.
          </p>
          <div className="mt-3 flex gap-1">
            <DisabledAction label="Save" />
          </div>
        </div>
      </div>
    </div>
  ),
});
