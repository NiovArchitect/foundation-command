import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEntities } from "@/hooks/useConsole";
import {
  CopyableId,
  DetailDrawer,
  FilterBar,
  HelpTooltip,
  PageHeader,
  PaginationFooter,
  ScopeBoundaryBanner,
  SearchInput,
  SelectFilter,
  StatusPill,
  Tabs,
  Table,
  TD,
  TH,
  THead,
  TR,
} from "@/components/console";
import { ENTITY_TYPE_FILTER_OPTIONS, REGISTRY_CATEGORIES } from "@/lib/entityTypes";
import type { ConsoleEntityRow } from "@/types/console";

export const Route = createFileRoute("/console/entities")({
  head: () => ({ meta: [{ title: "Entity Registry — NIOV Foundation Console" }] }),
  component: EntitiesPage,
});

const PAGE = 25;

// Registry tabs come from the canonical UX-label → entity_type mapping layer.
const CATEGORIES = REGISTRY_CATEGORIES;

function initialFromUrl(): { category: string; type: string } {
  if (typeof window === "undefined") return { category: "all", type: "" };
  const sp = new URLSearchParams(window.location.search);
  const type = sp.get("type") ?? "";
  const cat = CATEGORIES.find((c) => c.types.includes(type))?.id ?? "all";
  return { category: cat, type };
}

function EntitiesPage() {
  const [{ category, type: entityType }, setState] = React.useState(initialFromUrl);
  const [skip, setSkip] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<ConsoleEntityRow | null>(null);

  const activeCat = CATEGORIES.find((c) => c.id === category)!;
  const effectiveType =
    entityType || (activeCat.types.length === 1 ? activeCat.types[0] : "") || undefined;

  const { data } = useEntities({
    skip,
    take: PAGE,
    entity_type: effectiveType,
    status: status || undefined,
    q: q || undefined,
  });

  const items =
    activeCat.types.length > 1 && !entityType
      ? (data?.items ?? []).filter((e) => activeCat.types.includes(e.entity_type))
      : (data?.items ?? []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (effectiveType) sp.set("type", effectiveType);
    else sp.delete("type");
    const next = `${window.location.pathname}${sp.toString() ? `?${sp}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [effectiveType]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={
          <>
            Entity Registry
            <HelpTooltip term="Entity Registry" />
          </>
        }
        subtitle="Canonical registry of Foundation-supported entities. Metadata only — no capsule content."
        readiness="PARTIAL"
        generatedAt={data?.generated_at}
      />
      <Tabs
        tabs={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
        active={category}
        onChange={(id) => {
          setState({ category: id, type: "" });
          setSkip(0);
        }}
      />
      <FilterBar>
        <SelectFilter
          value={entityType}
          onChange={(v) => {
            setState((s) => ({ ...s, type: v }));
            setSkip(0);
          }}
          placeholder="Entity type"
          options={ENTITY_TYPE_FILTER_OPTIONS}
        />
        <SelectFilter
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSkip(0);
          }}
          placeholder="Status"
          options={["active", "suspended", "pending", "archived"]}
        />
        <SearchInput value={q} onChange={(v) => { setQ(v); setSkip(0); }} placeholder="Search entity id / name" />
        <div className="ml-auto text-[11px] text-muted-foreground">
          {items.length} shown · {data?.total ?? 0} total
        </div>
      </FilterBar>
      <Table>
        <THead>
          <TR>
            <TH>Entity</TH>
            <TH>Type</TH>
            <TH>Status</TH>
            <TH>Display Name</TH>
            <TH>Wallet</TH>
            <TH>Wallet Type</TH>
            <TH>Sessions</TH>
            <TH>Clearance</TH>
            <TH>Created</TH>
          </TR>
        </THead>
        <tbody>
          {items.map((e) => (
            <TR key={e.entity_id} onClick={() => setSelected(e)}>
              <TD><CopyableId value={e.entity_id} /></TD>
              <TD>{e.entity_type}</TD>
              <TD>
                <StatusPill
                  tone={
                    e.status === "active"
                      ? "ok"
                      : e.status === "suspended"
                        ? "danger"
                        : e.status === "pending"
                          ? "warn"
                          : "neutral"
                  }
                >
                  {e.status}
                </StatusPill>
              </TD>
              <TD>{e.display_name ?? "—"}</TD>
              <TD><CopyableId value={e.wallet_id} /></TD>
              <TD>{e.wallet_type ?? "—"}</TD>
              <TD mono>{e.active_sessions}</TD>
              <TD>{e.clearance_ceiling ?? "—"}</TD>
              <TD mono>{new Date(e.created_at).toISOString()}</TD>
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
        Individuals, employees, students, educators, agents, devices, and organizations are all
        Foundation-supported entities. The Console exposes metadata only — no capsule content.
      </ScopeBoundaryBanner>

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.display_name ?? "Entity"}
        subtitle={selected?.entity_id}
      >
        {selected && (
          <div className="flex flex-col gap-4 text-[12px]">
            <section>
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Identity
              </div>
              <KV k="entity_id" v={<span className="mono break-all">{selected.entity_id}</span>} />
              <KV k="entity_type" v={selected.entity_type} />
              <KV k="status" v={selected.status} />
              <KV k="display_name" v={selected.display_name ?? "—"} />
              <KV k="created_at" v={<span className="mono">{selected.created_at}</span>} />
            </section>
            <section>
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Wallet
              </div>
              <KV k="wallet_id" v={<span className="mono break-all">{selected.wallet_id ?? "—"}</span>} />
              <KV k="wallet_type" v={selected.wallet_type ?? "—"} />
            </section>
            <section>
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Sessions & Clearance
              </div>
              <KV k="active_sessions" v={<span className="mono">{selected.active_sessions}</span>} />
              <KV k="clearance_ceiling" v={selected.clearance_ceiling ?? "—"} />
            </section>
            <section>
              <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Capabilities
              </div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(selected.capabilities ?? {}).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-sm border border-border bg-surface px-2 py-1"
                  >
                    <span className="mono text-[11px] text-muted-foreground">{k}</span>
                    <StatusPill tone={v ? "ok" : "neutral"}>{v ? "yes" : "no"}</StatusPill>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-border py-1 last:border-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="min-w-0 text-foreground">{v}</div>
    </div>
  );
}
