import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAudit } from "@/hooks/useConsole";
import {
  CopyableId,
  DetailDrawer,
  FilterBar,
  PaginationFooter,
  PageHeader,
  ScrollBox,
  SearchInput,
  SelectFilter,
  Tabs,
  Table,
  TD,
  TH,
  THead,
  TR,
  StatusPill,
} from "@/components/console";
import type { ConsoleAuditEvent } from "@/types/console";

export const Route = createFileRoute("/console/governance/audit")({
  head: () => ({ meta: [{ title: "Governance & Audit Center — NIOV Foundation Console" }] }),
  component: AuditCenter,
});

const PAGE = 25;

const OUTCOME_TABS = [
  { id: "all", label: "All", outcome: "" },
  { id: "success", label: "Success", outcome: "success" },
  { id: "denied", label: "Denied", outcome: "denied" },
  { id: "error", label: "Error", outcome: "error" },
];

function AuditCenter() {
  const [skip, setSkip] = React.useState(0);
  const [eventType, setEventType] = React.useState("");
  const [outcomeTab, setOutcomeTab] = React.useState("all");
  const [actor, setActor] = React.useState("");
  const [selected, setSelected] = React.useState<ConsoleAuditEvent | null>(null);

  const outcome = OUTCOME_TABS.find((t) => t.id === outcomeTab)?.outcome ?? "";

  const { data } = useAudit({
    skip,
    take: PAGE,
    event_type: eventType || undefined,
    outcome: outcome || undefined,
    actor_entity_id: actor || undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Governance & Audit Center"
        subtitle="Audited events across substrate. Chain-hash integrity preserved per row."
        readiness="LIVE"
        generatedAt={data?.generated_at}
      />
      <Tabs
        tabs={OUTCOME_TABS.map((t) => ({ id: t.id, label: t.label }))}
        active={outcomeTab}
        onChange={(id) => {
          setOutcomeTab(id);
          setSkip(0);
        }}
      />
      <FilterBar>
        <SelectFilter
          value={eventType}
          onChange={(v) => {
            setEventType(v);
            setSkip(0);
          }}
          placeholder="Event type"
          options={[
            "ADMIN_ACTION",
            "CAPSULE_READ",
            "CAPSULE_WRITE",
            "CAPSULE_SHARE",
            "SESSION_START",
            "BREAK_GLASS_INVOKE",
            "BREAK_GLASS_USE",
            "BREAK_GLASS_REVIEW",
            "ESCALATION_OPEN",
            "ESCALATION_APPROVE",
            "ESCALATION_REJECT",
            "RATE_LIMIT_TRIGGERED",
            "POLICY_DECISION",
            "REGULATOR_ACCESS",
          ]}
        />
        <SearchInput value={actor} onChange={setActor} placeholder="Actor entity id" />
        <div className="ml-auto text-[11px] text-muted-foreground">
          {data?.total ?? 0} matching event(s)
        </div>
      </FilterBar>



      <Table>
        <THead>
          <TR>
            <TH>Created</TH>
            <TH>Event Type</TH>
            <TH>Outcome</TH>
            <TH>Actor</TH>
            <TH>Target</TH>
            <TH>Route</TH>
          </TR>
        </THead>
        <tbody>
          {data?.items.map((e) => (
            <TR key={e.audit_id} onClick={() => setSelected(e)}>
              <TD mono>{new Date(e.created_at).toISOString()}</TD>
              <TD>{e.event_type}</TD>
              <TD>
                <StatusPill
                  tone={e.outcome === "success" ? "ok" : e.outcome === "denied" ? "warn" : "danger"}
                >
                  {e.outcome}
                </StatusPill>
              </TD>
              <TD><CopyableId value={e.actor_entity_id} /></TD>
              <TD><CopyableId value={e.target_entity_id} /></TD>
              <TD mono>{e.route ?? "—"}</TD>
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
        title={selected?.event_type ?? ""}
        subtitle={selected?.audit_id}
      >
        {selected && (
          <div className="flex flex-col gap-3 text-[12px]">
            <KV k="audit_id" v={<span className="mono">{selected.audit_id}</span>} />
            <KV k="event_type" v={selected.event_type} />
            <KV k="outcome" v={selected.outcome} />
            <KV k="actor_entity_id" v={<span className="mono">{selected.actor_entity_id ?? "—"}</span>} />
            <KV k="target_entity_id" v={<span className="mono">{selected.target_entity_id ?? "—"}</span>} />
            <KV k="route" v={<span className="mono">{selected.route ?? "—"}</span>} />
            <KV k="created_at" v={<span className="mono">{selected.created_at}</span>} />
            <KV k="chain_hash" v={<span className="mono break-all">{selected.chain_hash}</span>} />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">details</div>
              <ScrollBox copyValue={JSON.stringify(selected.details, null, 2)} maxHeight={240}>
                {JSON.stringify(selected.details, null, 2)}
              </ScrollBox>
            </div>

          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-border pb-2 last:border-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-foreground">{v}</div>
    </div>
  );
}
