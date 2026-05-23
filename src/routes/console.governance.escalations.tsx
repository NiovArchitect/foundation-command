import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEscalations } from "@/hooks/useConsole";
import {
  DetailDrawer,
  DisabledAction,
  FilterBar,
  PageHeader,
  PaginationFooter,
  SelectFilter,
  StatusPill,
  Table,
  TD,
  TH,
  THead,
  TR,
  ScopeBoundaryBanner,
} from "@/components/console";
import type { ConsoleEscalationRow } from "@/types/console";

export const Route = createFileRoute("/console/governance/escalations")({
  head: () => ({ meta: [{ title: "Dual-Control / Escalations — NIOV Foundation Console" }] }),
  component: EscalationsPage,
});

const PAGE = 25;

function EscalationsPage() {
  const [skip, setSkip] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [actionType, setActionType] = React.useState("");
  const [selected, setSelected] = React.useState<ConsoleEscalationRow | null>(null);
  const { data } = useEscalations({
    skip,
    take: PAGE,
    status: status || undefined,
    action_type: actionType || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Dual-Control / Escalation Center"
        subtitle="Substrate dual-control queue. Approve and Reject actions are disabled in P0."
        readiness="PARTIAL"
        generatedAt={data?.generated_at}
        right={
          <div className="flex gap-1">
            <DisabledAction label="Approve" />
            <DisabledAction label="Reject" />
          </div>
        }
      />
      <FilterBar>
        <SelectFilter
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSkip(0);
          }}
          placeholder="Status"
          options={["pending", "approved", "rejected", "expired"]}
        />
        <SelectFilter
          value={actionType}
          onChange={(v) => {
            setActionType(v);
            setSkip(0);
          }}
          placeholder="Action type"
          options={["WRITE_CAPSULE", "SHARE_CAPSULE", "GRANT_ROLE", "REVOKE_ROLE"]}
        />
      </FilterBar>
      <Table>
        <THead>
          <TR>
            <TH>Escalation</TH>
            <TH>Source</TH>
            <TH>Target</TH>
            <TH>Action</TH>
            <TH>Status</TH>
            <TH>Created</TH>
            <TH>Expires</TH>
          </TR>
        </THead>
        <tbody>
          {data?.items.map((e) => (
            <TR key={e.escalation_id} onClick={() => setSelected(e)}>
              <TD mono className="max-w-[200px] truncate">{e.escalation_id}</TD>
              <TD mono className="max-w-[180px] truncate">{e.source_entity_id}</TD>
              <TD mono className="max-w-[180px] truncate">{e.target_entity_id ?? "—"}</TD>
              <TD>{e.action_type}</TD>
              <TD>
                <StatusPill
                  tone={
                    e.status === "approved"
                      ? "ok"
                      : e.status === "pending"
                        ? "warn"
                        : e.status === "rejected"
                          ? "danger"
                          : "neutral"
                  }
                >
                  {e.status}
                </StatusPill>
              </TD>
              <TD mono>{new Date(e.created_at).toISOString()}</TD>
              <TD mono>{e.expires_at ? new Date(e.expires_at).toISOString() : "—"}</TD>
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

      <ScopeBoundaryBanner>
        Dual-control approvals are a write surface. They remain disabled in P0; the Console is
        read-only.
      </ScopeBoundaryBanner>

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Escalation"
        subtitle={selected?.escalation_id}
      >
        {selected && (
          <div className="flex flex-col gap-2 text-[12px]">
            {Object.entries(selected).map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[180px_1fr] gap-3 border-b border-border pb-2 last:border-0"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="mono break-all text-foreground">{String(v ?? "—")}</div>
              </div>
            ))}
            <div className="mt-3 flex gap-2">
              <DisabledAction label="Approve" />
              <DisabledAction label="Reject" />
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
