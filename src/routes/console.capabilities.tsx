import { createFileRoute, Link } from "@tanstack/react-router";
import { useEntities } from "@/hooks/useConsole";
import {
  ConsoleBreadcrumbs,
  MetricCard,
  PageHeader,
  PageMeaningPanel,
  ScopeBoundaryBanner,
} from "@/components/console";

export const Route = createFileRoute("/console/capabilities")({
  head: () => ({ meta: [{ title: "Capabilities — NIOV Foundation Console" }] }),
  component: () => {
    const { data } = useEntities({ take: 200 });
    const items = data?.items ?? [];
    const count = (k: keyof NonNullable<(typeof items)[number]["capabilities"]>) =>
      items.filter((e) => e.capabilities?.[k]).length;
    const src = { kind: "route" as const, ref: "GET /api/v1/console/entities", existing: true };
    return (
      <div className="flex flex-col gap-5">
        <ConsoleBreadcrumbs
          items={[
            { label: "Console", to: "/console" },
            { label: "Integrations" },
            { label: "Capabilities" },
          ]}
        />
        <PageHeader
          title="Capability / Least-Privilege Center"
          subtitle="Capability distribution across entities. Two-tier admin model: can_admin_niov vs can_admin_org."
          readiness="PARTIAL"
          generatedAt={data?.generated_at}
        />
        <PageMeaningPanel
          layer="Control-plane"
          body="Capability and permission posture — not a general feature list."
          bullets={[
            "Least-privilege view: capability distribution across entities.",
            "Two-tier admin model: can_admin_niov (substrate) vs can_admin_org (org-scoped).",
          ]}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="can_admin_niov"
            value={count("can_admin_niov")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_admin_org"
            value={count("can_admin_org")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_read_capsules"
            value={count("can_read_capsules")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_write_capsules"
            value={count("can_write_capsules")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_share_capsules"
            value={count("can_share_capsules")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_create_hives"
            value={count("can_create_hives")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_access_external_api"
            value={count("can_access_external_api")}
            readiness="PARTIAL"
            source={src}
          />
          <MetricCard
            label="can_login"
            value={count("can_login")}
            readiness="PARTIAL"
            source={src}
          />
        </div>
        <ScopeBoundaryBanner>
          Two-tier admin model: <span className="mono">can_admin_niov</span> is the substrate-level
          Console privilege; <span className="mono">can_admin_org</span> is scoped to a single
          organization. The Foundation Console requires can_admin_niov.
        </ScopeBoundaryBanner>
        <Link
          to="/console/reports/$report_id"
          params={{ report_id: "capability_least_privilege" }}
          className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2"
        >
          Open Capability / Least-Privilege Report →
        </Link>
      </div>
    );
  },
});
