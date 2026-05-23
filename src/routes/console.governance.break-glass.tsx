import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useBreakGlassGrants } from "@/hooks/useConsole";
import {
  DetailDrawer,
  DisabledAction,
  FilterBar,
  PageHeader,
  PaginationFooter,
  ScopeBoundaryBanner,
  SelectFilter,
  StatusPill,
  Table,
  TD,
  TH,
  THead,
  TR,
} from "@/components/console";
import type { ConsoleBreakGlassGrantRow } from "@/types/console";

export const Route = createFileRoute("/console/governance/break-glass")({
  head: () => ({ meta: [{ title: "Break-Glass Review — NIOV Foundation Console" }] }),
  component: BreakGlassPage,
});

const PAGE = 25;

function BreakGlassPage() {
  const [skip, setSkip] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [action, setAction] = React.useState("");
  const [selected, setSelected] = React.useState<ConsoleBreakGlassGrantRow | null>(null);
  const { data } = useBreakGlassGrants({
    skip,
    take: PAGE,
    status: status || undefined,
    action_type: action || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Break-Glass Review Center"
        subtitle="Break-glass grant lifecycle. Justification is intentionally excluded from all surfaces."
        readiness="PARTIAL"
        generatedAt={data?.generated_at}
        right={<DisabledAction label="Review" />}
      />
      <ScopeBoundaryBanner tone="warn">
        Break-glass justification is intentionally excluded from list views and detail drawers.
      </ScopeBoundaryBanner>
      <FilterBar>
        <SelectFilter
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSkip(0);
          }}
          placeholder="Status"
          options={["active", "used", "expired", "reviewed", "revoked"]}
        />
        <SelectFilter
          value={action}
          onChange={(v) => {
            setAction(v);
            setSkip(0);
          }}
          placeholder="Action type"
          options={["READ_CAPSULE_OVERRIDE", "DECRYPT_OVERRIDE", "POLICY_OVERRIDE", "ACCESS_RESET"]}
        />
      </FilterBar>
      <Table>
        <THead>
          <TR>
            <TH>Grant</TH>
            <TH>Source</TH>
            <TH>Action</TH>
            <TH>Status</TH>
            <TH>Valid From</TH>
            <TH>Valid Until</TH>
            <TH>Used</TH>
            <TH>Reviewed</TH>
          </TR>
        </THead>
        <tbody>
          {data?.items.map((g) => (
            <TR key={g.grant_id} onClick={() => setSelected(g)}>
              <TD mono className="max-w-[200px] truncate">{g.grant_id}</TD>
              <TD mono className="max-w-[180px] truncate">{g.source_entity_id}</TD>
              <TD>{g.action_type}</TD>
              <TD>
                <StatusPill
                  tone={
                    g.status === "active"
                      ? "warn"
                      : g.status === "reviewed"
                        ? "ok"
                        : g.status === "revoked"
                          ? "danger"
                          : "neutral"
                  }
                >
                  {g.status}
                </StatusPill>
              </TD>
              <TD mono>{new Date(g.valid_from).toISOString()}</TD>
              <TD mono>{new Date(g.valid_until).toISOString()}</TD>
              <TD mono>{g.used_at ? new Date(g.used_at).toISOString() : "—"}</TD>
              <TD mono>{g.reviewed_at ? new Date(g.reviewed_at).toISOString() : "—"}</TD>
            </TR>
          ))}
        </tbody>
      </Table>
      {data && (
        <PaginationFooter
          skip={skip}
          take={PAGE}
          total={data.total}
          hasMore={data.has_more}
          onPrev={() => setSkip(Math.max(0, skip - PAGE))}
          onNext={() => setSkip(skip + PAGE)}
        />
      )}
      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Break-Glass Grant"
        subtitle={selected?.grant_id}
      >
        {selected && (
          <div className="flex flex-col gap-2 text-[12px]">
            {Object.entries(selected).map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[200px_1fr] gap-3 border-b border-border pb-2 last:border-0"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="mono break-all text-foreground">{String(v ?? "—")}</div>
              </div>
            ))}
            <div className="mt-3 text-[11px] text-warning">
              Break-glass justification is intentionally excluded from this surface.
            </div>
            <div>
              <DisabledAction label="Review" />
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
