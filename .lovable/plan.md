# NIOV Foundation Console — P0 Frontend Shell Plan

## Confirmations (non-negotiable)

- Frontend-only. No backend, schema, migrations, auth logic, policy logic, wallet logic, capsule-permission logic, audit-chain logic, market-pricing logic, regulator-disclosure logic, or write actions.
- Mock adapter only (`USE_MOCK = true`). No real backend calls.
- All seven real backend contracts mirrored exactly in `mockConsoleApi` (overview, audit, entities, break-glass grants, escalations, reports list, report by id).
- Report Catalog renders exactly 18 reports, with `wallet_entity_growth` included as report #5.
- No raw capsule content, no encrypted payloads, no content URLs, no plaintext.
- No break-glass justification anywhere (lists or drawers).
- No live market pricing; exchange marked MOCK/FUTURE with the required banner.
- Foundation-supported actors (enterprises, employees, individuals, students, educators, schools, institutions, developers, regulators, governments, agents, devices/robotics) are surfaced as scoped/application-side/domain-side readiness pages — not as substrate-wide Console users.
- Substrate-wide Foundation Console access is limited to authorized NIOV operators (`can_admin_niov`); `ConsoleOperatorRole` shown as P1/future.
- Every non-LIVE surface carries `PARTIAL`, `MOCK`, or `FUTURE` readiness with `ReadinessBadge` + `MockDataBanner` + `DataFreshnessIndicator`.
- All write-implying buttons (Approve, Reject, Revoke, Export, Save, Grant, Create, Update, Invite, Configure, Delete) rendered disabled with tooltip "Read-only P0 Console surface."

## Stack & conventions

- React + TypeScript on the existing TanStack Start template, frontend-only.
- File-based routing under `src/routes/console.*.tsx` (flat dot convention; `__root.tsx` keeps the shell). Each route has its own `head()` metadata.
- TanStack Query for all data reads via hooks (`useOverview`, `useAudit`, `useEntities`, `useBreakGlassGrants`, `useEscalations`, `useReports`, `useReport`) — swappable to real fetch later without touching components.
- Dark-mode-first design tokens defined in `src/styles.css` (oklch). No raw color classes in components; semantic tokens only (background, surface, border, muted, primary, accent, success, warning, danger, info).
- Visual reference: AWS Control Tower / Stripe / Cloudflare Zero Trust / Datadog / Snowflake Governance. Glass-like dark panels, 1px borders, dense tables, monospace for IDs/hashes, minimal motion, no emojis.
- Root `/` redirects to `/console`.

## File structure

```text
src/
  mock/
    mockConsoleApi.ts           # the 7 methods + fixtures
    fixtures/
      overview.ts
      audit.ts
      entities.ts
      breakGlass.ts
      escalations.ts
      reports.ts                # 18 ConsoleReportSummary + ConsoleReport bodies
  types/
    console.ts                  # all interfaces verbatim from spec section 16
  hooks/
    useOverview.ts
    useAudit.ts
    useEntities.ts
    useBreakGlassGrants.ts
    useEscalations.ts
    useReports.ts
    useReport.ts
  components/console/
    ReadinessBadge.tsx
    StatusPill.tsx
    RiskBadge.tsx
    SecurityClassBadge.tsx
    MetricCard.tsx
    ReportCard.tsx
    ReportTable.tsx
    ReportChart.tsx
    AuditTimeline.tsx
    EntityDrawer.tsx
    BreakGlassGrantDrawer.tsx
    EscalationDrawer.tsx
    SourceMappingBadge.tsx
    EmptyState.tsx
    WarningState.tsx
    MockDataBanner.tsx
    DataFreshnessIndicator.tsx
    CommandCenterSection.tsx
    SidebarNavigation.tsx
    PageHeader.tsx
    FilterBar.tsx
    SearchInput.tsx
    DetailDrawer.tsx
    DomainReadinessCard.tsx
    ScopeBoundaryBanner.tsx
    DisabledAction.tsx          # wraps buttons w/ "Read-only P0 Console surface." tooltip
  routes/
    __root.tsx                  # shell: sidebar + topbar + MockDataBanner + Outlet
    index.tsx                   # redirect → /console
    console.tsx                 # layout route (Outlet)
    console.index.tsx           # Foundation Command Center
    console.health.tsx
    console.governance.audit.tsx
    console.governance.escalations.tsx
    console.governance.break-glass.tsx
    console.capabilities.tsx
    console.entities.tsx
    console.capsules.tsx
    console.gateway.tsx
    console.reports.tsx
    console.reports.$report_id.tsx
    console.compliance.tsx
    console.proof.tsx
    console.exchange.tsx
    console.agents.tsx
    console.developer.tsx
    console.organizations.tsx
    console.education.tsx
    console.individuals.tsx
    console.employees.tsx
    console.governments.tsx
    console.devices.tsx
    console.settings.tsx
    console.access.tsx
```

## Global shell

- Left `SidebarNavigation` with the exact groups from spec §15 (Command, Governance, Foundation Data, Reports, Ecosystem, System).
- Top bar: "NIOV Foundation Console" wordmark, environment pill, overall Foundation status pill, "Read-only P0 Console surface" chip.
- Global `MockDataBanner`: "Backend contract landed; frontend currently using mock adapter."
- Subtitle on Command Center: "Operational control plane for governed memory, scoped intelligence, audit, and enterprise AI infrastructure."
- `PageHeader` with title, `ReadinessBadge`, `DataFreshnessIndicator`, and optional `ScopeBoundaryBanner`.

## Mock adapter

`mockConsoleApi` exposes exactly the seven async methods in spec §13, returning shapes that match `ConsoleOverviewResponse`, `ConsolePaginated<…>`, and the report types verbatim. Fixed overview values per §20 (govsec5_status="CLOSED", adr_0049_status="Proposed", gap_o7_status="OPEN", govsec7_status="NOT_STARTED", console1_status="P0_BACKEND", live_counters_available=false, market_surface_status="PARTIAL", cohort_pricing_status="FUTURE", hive_surface_status="PARTIAL", cosmp_dbgi_telemetry_status="FUTURE"). Pagination, filters, and search implemented in-memory against fixtures. `generated_at` recomputed per call so `DataFreshnessIndicator` is real.

## Report catalog (18, readiness per §12/§17)

LIVE: governance_audit. MOCK: monetization_exchange. FUTURE: regulator_proof. PARTIAL: foundation_health, break_glass, dual_control, wallet_entity_growth (#5), capsule_movement, permission_revocation, gateway_ratelimit, developer_api_usage, agent_hive_swarm, org_activity, compliance_export, capability_least_privilege, security_anomaly, session_access, audit_chain_integrity. All `export_options` present as disabled metadata (csv/json/pdf, enabled:false). Each report body includes sections with cards/tables/charts/timelines, sources, filters, empty/warning states, and drilldown links per §16.

## Page coverage

Every route in spec §14 and §18 is implemented:
- `/console` Command Center renders all 10 sections from `getOverview()`.
- Governance pages bind to audit / break-glass / escalations adapters with the exact column sets in §18; row clicks open the matching drawers; break-glass omits justification.
- Entities Explorer + EntityDrawer (capabilities matrix, clearance ceiling, sessions; no capsule content).
- Reports Catalog filters by readiness/audience/priority; Report Detail renders the full `ConsoleReport` shape with disabled exports and a not-found page for unknown ids; `/console/reports/audit_chain_integrity` is a direct shortcut.
- Health, Gateway (with `live_counters_available: false` banner), Capsules (with "No raw capsule content displayed."), Capabilities, Compliance, Proof (FUTURE + scope banner), Exchange (MOCK + market pricing banner), Agents, Developer, Organizations, Education, Individuals, Employees, Governments, Devices — all use `DomainReadinessCard` + `ScopeBoundaryBanner` with the exact copy strings from §11 and §21.
- Settings (FUTURE, read-only) and Console Access (FUTURE; "ConsoleOperatorRole is P1/future; current backend requires can_admin_niov.") are static mock pages.

## Acceptance mapping

All 37 acceptance criteria in spec §24 are addressed by the structure above: contracts mirrored, 18 reports including wallet_entity_growth at #5, disabled write actions with the required tooltip, scope banners on every domain page, no raw capsule content, no break-glass justification, no live market pricing, regulator/proof FUTURE-scoped, Console Access marked P1/future, and a dark-mode enterprise control-plane aesthetic.

Approve to proceed to build.
