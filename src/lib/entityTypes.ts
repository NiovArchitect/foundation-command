/**
 * Canonical UX-label → backend EntityType mapping layer.
 *
 * Single source of truth that reconciles the Console's UX domain labels
 * (sidebar, ecosystem cards, Entity Registry tabs) with the backend
 * `entity_type` values exposed by `GET /api/v1/console/entities`.
 *
 * Frontend-only. No backend calls live here. The Console exposes entity
 * METADATA only — never capsule content. For application-side domains (e.g.
 * Education) the end-user record types are intentionally NOT surfaced as a
 * registry deep-link target; see `registryQueryType` below.
 */

/** Backend EntityType values, as landed in the Console contracts. */
export const CONSOLE_ENTITY_TYPES = [
  "individual",
  "employee",
  "organization",
  "student",
  "educator",
  "agent",
  "device",
  "institution",
] as const;

export type ConsoleEntityType = (typeof CONSOLE_ENTITY_TYPES)[number];

export interface ConsoleDomainMapping {
  /** UX domain id; matches the ecosystem route slug and registry category id. */
  id: string;
  /** Human-facing label shown in navigation and registry tabs. */
  label: string;
  /** All backend EntityTypes this UX domain corresponds to. */
  entityTypes: ConsoleEntityType[];
  /**
   * The entity_type the Console deep-links to when navigating into the Entity
   * Registry for this domain. For application-side domains this is the
   * institution / org-level metadata type — never a raw end-user record type.
   */
  registryQueryType?: ConsoleEntityType;
  /**
   * False when the domain's end users (e.g. students, educators) are served
   * application-side and are NOT directly queryable as Console registry rows.
   */
  endUsersConsoleQueryable: boolean;
}

/** Canonical UX domain → backend entity_type mapping. */
export const CONSOLE_DOMAINS: ConsoleDomainMapping[] = [
  {
    id: "organizations",
    label: "Organizations",
    entityTypes: ["organization"],
    registryQueryType: "organization",
    endUsersConsoleQueryable: true,
  },
  {
    id: "individuals",
    label: "Individuals",
    entityTypes: ["individual"],
    registryQueryType: "individual",
    endUsersConsoleQueryable: true,
  },
  {
    id: "employees",
    label: "Employees",
    entityTypes: ["employee"],
    registryQueryType: "employee",
    endUsersConsoleQueryable: true,
  },
  {
    id: "education",
    label: "Education",
    entityTypes: ["student", "educator", "institution"],
    // Console deep-links to institution-level metadata only. Student/educator
    // records are served application-side and are not Console-queryable.
    registryQueryType: "institution",
    endUsersConsoleQueryable: false,
  },
  {
    id: "governments",
    label: "Government / Public Sector",
    entityTypes: ["institution"],
    registryQueryType: "institution",
    endUsersConsoleQueryable: true,
  },
  {
    id: "agents",
    label: "Agents",
    entityTypes: ["agent"],
    registryQueryType: "agent",
    endUsersConsoleQueryable: true,
  },
  {
    id: "devices",
    label: "Devices",
    entityTypes: ["device"],
    registryQueryType: "device",
    endUsersConsoleQueryable: true,
  },
];

export const domainById = (id: string): ConsoleDomainMapping | undefined =>
  CONSOLE_DOMAINS.find((d) => d.id === id);

/** Entity Registry tabs, derived from the canonical domain mapping. */
export const REGISTRY_CATEGORIES: { id: string; label: string; types: string[] }[] = [
  { id: "all", label: "All", types: [] },
  ...["organizations", "individuals", "employees", "education", "agents", "devices"].map((id) => {
    const d = domainById(id)!;
    return { id: d.id, label: d.label, types: [...d.entityTypes] as string[] };
  }),
];

/** Flat list of selectable entity_type filter values. */
export const ENTITY_TYPE_FILTER_OPTIONS: ConsoleEntityType[] = [...CONSOLE_ENTITY_TYPES];

/**
 * Build the frontend Entity Registry route href for a given backend
 * entity_type. The registry reads the `type` search param (distinct from the
 * backend `entity_type` API param). Returns the unfiltered registry when no
 * type is supplied.
 */
export const entitiesHrefForType = (type?: ConsoleEntityType): string =>
  type ? `/console/entities?type=${encodeURIComponent(type)}` : "/console/entities";

/**
 * Canonical macro-categories. The Console surfaces (and callers) use many UX /
 * domain synonyms for the same underlying actor; these normalize onto a small,
 * stable set so any label resolves without leaking new values into the backend
 * `entity_type` contract.
 */
export type ConsoleEntityCategory =
  | "PERSON"
  | "COMPANY"
  | "GOVERNMENT"
  | "AI_AGENT"
  | "DEVICE"
  | "REGULATOR";

export interface UxLabelMapping {
  category: ConsoleEntityCategory;
  /** Closest backend entity_type, when one exists for this label. */
  entityType?: ConsoleEntityType;
}

/**
 * UX / domain label (and common synonyms) → canonical category + nearest backend
 * entity_type. This is the canonical reconciliation table for the layer.
 *
 * Keys are normalized: lower-cased, with spaces/underscores collapsed to a
 * single hyphen (see {@link normalizeUxLabel}). Labels that have no direct
 * backend entity_type (e.g. guardian, parent, developer, regulator, auditor,
 * accreditor) map to a category only — they are served application-side and are
 * never minted as new backend entity_type values.
 */
export const UX_LABEL_TO_ENTITY: Record<string, UxLabelMapping> = {
  // PERSON-equivalent
  individual: { category: "PERSON", entityType: "individual" },
  person: { category: "PERSON", entityType: "individual" },
  employee: { category: "PERSON", entityType: "employee" },
  student: { category: "PERSON", entityType: "student" },
  educator: { category: "PERSON", entityType: "educator" },
  guardian: { category: "PERSON" },
  parent: { category: "PERSON" },
  developer: { category: "PERSON" },
  // COMPANY-equivalent
  organization: { category: "COMPANY", entityType: "organization" },
  enterprise: { category: "COMPANY", entityType: "organization" },
  company: { category: "COMPANY", entityType: "organization" },
  institution: { category: "COMPANY", entityType: "institution" },
  school: { category: "COMPANY", entityType: "institution" },
  // GOVERNMENT-equivalent
  government: { category: "GOVERNMENT", entityType: "institution" },
  "public-sector": { category: "GOVERNMENT", entityType: "institution" },
  // AI_AGENT-equivalent
  agent: { category: "AI_AGENT", entityType: "agent" },
  "ai-agent": { category: "AI_AGENT", entityType: "agent" },
  // DEVICE-equivalent
  device: { category: "DEVICE", entityType: "device" },
  robot: { category: "DEVICE", entityType: "device" },
  robotics: { category: "DEVICE", entityType: "device" },
  // REGULATOR-equivalent
  regulator: { category: "REGULATOR" },
  auditor: { category: "REGULATOR" },
  accreditor: { category: "REGULATOR" },
};

/** Normalize an arbitrary UX/domain label for table lookup. */
export const normalizeUxLabel = (label: string): string =>
  label
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

/** Resolve a UX/domain label (or synonym) to its canonical mapping. */
export const mappingForLabel = (label: string): UxLabelMapping | undefined =>
  UX_LABEL_TO_ENTITY[normalizeUxLabel(label)];

/** Resolve a UX/domain label (or synonym) to its canonical macro-category. */
export const categoryForLabel = (label: string): ConsoleEntityCategory | undefined =>
  mappingForLabel(label)?.category;
