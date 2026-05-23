import { createFileRoute, Link } from "@tanstack/react-router";
import { useOverview } from "@/hooks/useConsole";
import {
  MetricCard,
  PageHeader,
  ScopeBoundaryBanner,
} from "@/components/console";

export const Route = createFileRoute("/console/capsules")({
  head: () => ({ meta: [{ title: "Memory Capsules — NIOV Foundation Console" }] }),
  component: CapsulesPage,
});

function CapsulesPage() {
  const { data } = useOverview();
  const c = data?.capsules;
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Memory Capsule Explorer"
        subtitle="Capsule metadata only. No raw capsule content displayed."
        readiness={c?.readiness ?? "PARTIAL"}
        generatedAt={data?.generated_at}
      />
      <ScopeBoundaryBanner tone="warn">
        No raw capsule content displayed. No encrypted content, content URL, plaintext, or decrypted
        content is exposed by the Console.
      </ScopeBoundaryBanner>
      {c && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <MetricCard
            label="Total Capsules"
            value={c.total_capsules.toLocaleString()}
            readiness="PARTIAL"
            source={{ kind: "route", ref: "overview.capsules.total_capsules", existing: true }}
          />
          <MetricCard
            label="Recent Capsule Events"
            value={c.recent_capsule_events.toLocaleString()}
            readiness="PARTIAL"
            source={{ kind: "route", ref: "overview.capsules.recent_capsule_events", existing: true }}
          />
        </div>
      )}
      <Link
        to="/console/reports/$report_id"
        params={{ report_id: "capsule_movement" }}
        className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
      >
        Open Memory Capsule Movement Report →
      </Link>
    </div>
  );
}
