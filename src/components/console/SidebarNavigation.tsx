import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string };
type NavGroup = { label: string; items: NavItem[]; defaultOpen: boolean };

const GROUPS: NavGroup[] = [
  {
    label: "Command",
    defaultOpen: true,
    items: [
      { label: "Home", to: "/console" },
      { label: "Foundation Health", to: "/console/health" },
    ],
  },
  {
    label: "Entities & Ecosystem",
    defaultOpen: true,
    items: [
      { label: "Entity Registry", to: "/console/entities" },
      { label: "Ecosystem Overview", to: "/console/ecosystem" },
      { label: "Organizations", to: "/console/organizations" },
      { label: "Individuals", to: "/console/individuals" },
      { label: "Employees", to: "/console/employees" },
      { label: "Education", to: "/console/education" },
      { label: "Government / Public Sector", to: "/console/governments" },
      { label: "Devices & Robotics", to: "/console/devices" },
    ],
  },
  {
    label: "Governance",
    defaultOpen: false,
    items: [
      { label: "Audit Center", to: "/console/governance/audit" },
      { label: "Break-Glass Grants", to: "/console/governance/break-glass" },
      { label: "Escalations", to: "/console/governance/escalations" },
      { label: "Access Control", to: "/console/access" },
    ],
  },
  {
    label: "Data, Proof & Intelligence",
    defaultOpen: false,
    items: [
      { label: "Capsules", to: "/console/capsules" },
      { label: "Proof Services", to: "/console/proof" },
      { label: "Intelligence Exchange", to: "/console/exchange" },
      { label: "Agent & Swarm Ops", to: "/console/agents" },
    ],
  },
  {
    label: "Reports & Compliance",
    defaultOpen: false,
    items: [
      { label: "Reports", to: "/console/reports" },
      { label: "Compliance / Export Center", to: "/console/compliance" },
      { label: "Audit Chain Integrity", to: "/console/reports/audit_chain_integrity" },
    ],
  },
  {
    label: "Integrations",
    defaultOpen: false,
    items: [
      { label: "API Gateway", to: "/console/gateway" },
      { label: "Developer / API Integrations", to: "/console/developer" },
      { label: "Capabilities", to: "/console/capabilities" },
    ],
  },
  {
    label: "Administration",
    defaultOpen: false,
    items: [{ label: "Settings", to: "/console/settings" }],
  },
];

export function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex h-full w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border bg-surface px-3 py-4">
      <div className="px-2 pb-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          NIOV Foundation
        </div>
        <div className="mt-0.5 text-sm font-semibold text-foreground">Console</div>
      </div>
      {GROUPS.map((g) => {
        const containsActive = g.items.some(
          (it) =>
            pathname === it.to || (it.to !== "/console" && pathname.startsWith(it.to + "/")),
        );
        return (
          <CollapsibleGroup
            key={g.label}
            label={g.label}
            defaultOpen={g.defaultOpen || containsActive}
          >
            <ul className="flex flex-col">
              {g.items.map((it) => {
                const active =
                  pathname === it.to ||
                  (it.to !== "/console" && pathname.startsWith(it.to + "/"));
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      onClick={onNavigate}
                      className={cn(
                        "block rounded-sm px-2 py-1.5 text-[12px] leading-tight text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                        active && "bg-accent/40 text-foreground",
                      )}
                    >
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CollapsibleGroup>
        );
      })}
      <div className="mt-auto rounded-sm border border-border bg-surface-2 p-2 text-[10px] text-muted-foreground">
        Substrate-level operator surface. Requires{" "}
        <span className="mono text-foreground">can_admin_niov</span>.
      </div>
    </nav>
  );
}

function CollapsibleGroup({
  label,
  defaultOpen,
  children,
}: {
  label: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  React.useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80 hover:text-foreground"
      >
        <span>{label}</span>
        <span className="text-[10px]">{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}
