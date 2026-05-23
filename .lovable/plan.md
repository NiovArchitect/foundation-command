# NIOV Foundation Console — P0 UX Refinement Plan

Refines the existing shell into a guided enterprise operator workspace. No backend, no writes, no new safety relaxations. Mock adapter, 18 reports, type contracts, and route IDs all preserved.

## 1. Global shell

- **Sidebar**: convert flat list into collapsible groups using shadcn `Sidebar` + `SidebarGroup` with `Collapsible`. Default-expanded: Command, Governance, Foundation Data. Default-collapsed: Reports, Ecosystem, System. Active route auto-expands its group. Mobile: `Sheet` drawer, hamburger in `TopBar`.
- **Sidebar items**: rename "Wallets & Entities" → "Entity Registry" (route unchanged: `/console/entities`). Add "Ecosystem Overview" at top of Ecosystem group.
- **TopBar**: add theme toggle (Dark / Light / System) persisted to `localStorage["niov-console-theme"]`, env pill, foundation status pill, "Read-only P0" chip, mobile menu trigger.
- **Theme tokens**: extend `src/styles.css` with refined light-mode tokens (white bg, soft grey surfaces, steel-blue accents) — already partially in place; finalize all semantic tokens (`--mock`, `--future`, `--partial`, `--live`) for both modes; verify badges/pills in both.

## 2. Reusable primitives (additions to `components/console/index.tsx`)

- `HelpTooltip` — `?` icon + Radix tooltip; preloaded glossary map for the 12 terms listed in spec §7.
- `PageHeader` v2 — title, subtitle, readiness/access/data-mode/writes badge row, "What to inspect first", "Intentionally excluded", and a collapsed `SourceMappingAccordion`.
- `CopyableId` — monospace, middle-truncated (`ent_1234…abcd`), click-to-copy with toast.
- `ClampText` — line-clamp w/ "Expand" → opens `DetailDrawer` or inline accordion.
- `ScrollBox` — fixed max-height, monospace, copy button, wrap toggle for JSON/long source mapping.
- `DensityToggle`, `ColumnVisibilityMenu`, `Pagination` (already exists), `SavedFilterChips`.
- `DomainCard` — name, audience, actor types, readiness, mock entity count, open issues, primary route, "View readiness" / "View entities" links, scope-boundary note.
- `CriticalAttentionItem` — severity, label, source route, Inspect link.
- `FoundationPlaneCard` — title, description, link cluster.
- `DemoGuidePanel` — right-side `Sheet` with 12 ordered steps + deep links.

## 3. Command Center (`/console`)

Restructure `console.index.tsx` into ordered sections, replacing the current card wall:

1. **Foundation Status Hero** — overall status, env, backend contract, mock-mode chip, GOVSEC.5/GAP-O7/GOVSEC.7/Console mode, plain-English operator summary paragraph.
2. **Critical Attention Queue** — derived from mock overview (open escalations, active break-glass, anomalies, audit warnings, unavailable live counters, future telemetry gaps). Empty-state copy from spec.
3. **Foundation Planes** — 5 `FoundationPlaneCard`s (Memory / Permission / Governance / Execution / Integration) with the exact descriptions and link sets.
4. **Operational Snapshot Tabs** — shadcn `Tabs` (default Health). Tabs: Health, Governance, Entities, Capsules, Gateway, Compliance, Exchange, Agents, Reports. Each tab shows only its relevant metric cards (≤12 visible).
5. **Recent Activity** — compact audit timeline from `useAudit({ take: 8 })`.
6. **Reports Panel** — totals by readiness + link to catalog.
7. **Demo Guide button** — opens `DemoGuidePanel` sheet.

## 4. Ecosystem layer

- New route `/console/ecosystem` (`console.ecosystem.tsx`) — overview with 10 `DomainCard`s.
- Each existing ecosystem route (organizations, education, individuals, employees, governments, developer, devices, proof, exchange, agents) restructured with `Tabs`: Overview / Entities / Reports / Boundaries / Source Mapping.
  - **Entities** tab: preview table (top 5) + "View all in Entity Registry" link with prefilled filter query params.
  - **Boundaries** tab: scoped-actor explanation, application-side framing.
- Education page adds sub-cards: Students, Educators, Schools, Institutions, Guardians, Accreditation — each with readiness + filtered registry link.

## 5. Entity Registry (`/console/entities`)

Make it the canonical object layer:

- Page title "Foundation Entity Registry". Top summary card row (totals by category + active sessions).
- Category tabs: All / Organizations / Individuals / Employees / Education / Government / Developers / Regulators-Proof / Agents-Devices-Robotics. Each tab pre-applies an `entity_type` filter against `useEntities`.
- Filter bar: search, entity_type, domain, status, wallet_type, capability, readiness, active-sessions toggle, created-date range. URL query-param sync so ecosystem deep links work.
- Table columns per spec §5 with `CopyableId` for `entity_id` / `wallet_id`, `ReadinessBadge`, truncation, pagination (10), density toggle.
- Row click → `EntityDrawer` with tabs: Overview / Wallet / Capabilities / Sessions / Domain Relationships / Audit Trail / Safety Boundaries. Metadata-only; no capsule content or private records.

## 6. Governance pages

- **Audit Center**: saved filter chips, search, copy `audit_id` + `chain_hash`, drawer per row, timeline view toggle.
- **Break-Glass**: status tabs (Active / Used / Expired / Reviewed / All), `HelpTooltip` on title, drawer excludes justification (already enforced — keep).
- **Escalations**: status tabs (Pending / Approved / Rejected / Expired / All), action-type filter, drawer, disabled Approve/Reject with tooltip.
- **Capabilities**: unchanged structure; add `PageHeader` v2 and source mapping accordion.

## 7. Reports

- **Catalog**: search + readiness dropdown + category tabs (Health / Governance / Entities / Capsules / Gateway / Compliance / Exchange / Developer / Agents). 18-report set unchanged; `wallet_entity_growth` stays #5.
- **Report Detail**: convert vertical dump into tabs — Summary / Metrics / Tables / Timeline / Sources / Export Metadata. Export buttons remain disabled with required tooltip.

## 8. Other pages

- Gateway: `live_counters_available: false` banner kept; operation classes as compact chips; future telemetry warning.
- Capsules: keep "no raw capsule content" banner.
- Proof: FUTURE + scope banner; tabs structure.
- Exchange: MOCK/FUTURE banner; no live prices.
- Settings + Console Access: read-only, `HelpTooltip` on `can_admin_niov` / `ConsoleOperatorRole`, no role editor.

## 9. Text-overflow + density rules

- Card titles `line-clamp-2`, descriptions `line-clamp-3` + Expand.
- All long-form copy in `ClampText` / `ScrollBox`.
- All IDs/hashes through `CopyableId`.
- Tables default 10 rows, density toggle, sticky header on `overflow-x-auto`, max row height.

## 10. Files to add / edit

Add:
```
src/hooks/useTheme.ts
src/lib/glossary.ts
src/components/console/HelpTooltip.tsx
src/components/console/CopyableId.tsx
src/components/console/ClampText.tsx
src/components/console/ScrollBox.tsx
src/components/console/DomainCard.tsx
src/components/console/FoundationPlaneCard.tsx
src/components/console/CriticalAttentionQueue.tsx
src/components/console/OperationalSnapshotTabs.tsx
src/components/console/DemoGuidePanel.tsx
src/components/console/SourceMappingAccordion.tsx
src/components/console/ThemeToggle.tsx
src/routes/console.ecosystem.tsx
```

Edit:
```
src/components/console/SidebarNavigation.tsx     (collapsible groups, rename, mobile)
src/components/console/TopBar.tsx                (theme toggle, mobile menu)
src/components/console/index.tsx                 (PageHeader v2, primitives)
src/routes/console.index.tsx                     (restructure into 7 sections)
src/routes/console.entities.tsx                  (tabs, filters, drawer tabs, summary)
src/routes/console.reports.tsx                   (category tabs, search, readiness)
src/routes/console.reports.$report_id.tsx        (tabbed detail)
src/routes/console.governance.audit.tsx          (chips, copy, timeline)
src/routes/console.governance.break-glass.tsx    (status tabs, tooltip)
src/routes/console.governance.escalations.tsx    (status tabs)
src/routes/console.organizations.tsx             (5-tab pattern)
src/routes/console.education.tsx                 (sub-cards + tabs)
src/routes/console.individuals.tsx               (tabs)
src/routes/console.employees.tsx                 (tabs)
src/routes/console.governments.tsx               (tabs)
src/routes/console.devices.tsx                   (tabs)
src/routes/console.developer.tsx                 (tabs)
src/routes/console.proof.tsx                     (tabs)
src/routes/console.exchange.tsx                  (tabs)
src/routes/console.agents.tsx                    (tabs)
src/routes/console.gateway.tsx                   (chips, telemetry warning)
src/routes/console.capabilities.tsx              (PageHeader v2)
src/routes/console.capsules.tsx                  (PageHeader v2)
src/routes/console.compliance.tsx                (PageHeader v2)
src/routes/console.settings.tsx                  (tooltips)
src/routes/console.access.tsx                    (tooltips)
src/styles.css                                   (finalize light/dark tokens)
```

## 11. Verification

- Build + typecheck pass.
- 941px viewport: no overflow, sidebar collapses to drawer trigger, tables scroll, drawers become sheets.
- Theme toggle persists across reload; all badges legible in both modes.
- Ecosystem → domain card → filtered Entity Registry round-trip works via URL params.
- Command Center renders ≤12 visible metric cards before tab switching.
- All disabled buttons still surface "Read-only P0 Console surface." tooltip.
- No capsule content, no break-glass justification, no live prices, no broad substrate framing for non-NIOV actors anywhere.

## Out of scope

No backend, no auth, no schema, no new reports, no removal of safety constraints, no new mock contracts, no real fetch calls.

Approve to proceed to build.