/**
 * Per-domain page copy for the ecosystem/application-side Console pages.
 *
 * Keeps the shared `EcosystemDomainPage` shell while giving each domain a
 * distinct "what this is / why it matters" explanation so Organizations,
 * Individuals, Employees, Education, Government, and Devices no longer read as
 * interchangeable. Frontend copy only — no data, no backend, no behavior.
 *
 * Boundary discipline (must hold):
 *  - These are domain VIEWS over governed entities in the Foundation Entity
 *    Registry — not separate Foundation substrates.
 *  - Otzar is referenced only as an application-readiness PREVIEW built on the
 *    Foundation; it is not part of this repository.
 */
import type { ConsoleLayer } from "@/components/console";

export interface EcosystemDomainCopy {
  layer: ConsoleLayer;
  whatItIs: string;
  whyItMatters: string;
  foundationRelation: string;
  otzarRelation: string;
  actorExamples: string;
}

export const ECOSYSTEM_DOMAIN_COPY: Record<string, EcosystemDomainCopy> = {
  ecosystem: {
    layer: "Application-side",
    whatItIs: "The application-side view over the Foundation's governed actor domains.",
    whyItMatters:
      "It shows who the Foundation serves and how each domain maps to governed entities — without becoming a separate substrate.",
    foundationRelation:
      "Not a separate Foundation substrate — every domain here is a view over governed entities in the Foundation Entity Registry.",
    otzarRelation:
      "Application-readiness preview: apps like Otzar can be built on these governed rails. (Otzar is not part of this repository.)",
    actorExamples:
      "Domains: organizations, individuals, employees, education, government, devices.",
  },
  organizations: {
    layer: "Application-side",
    whatItIs: "Companies, tenants, enterprise domains, and partner/requester organizations.",
    whyItMatters:
      "Org-scoped governance lets enterprises operate on the Foundation without cross-tenant leakage.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for org-scoped apps like Otzar (not shipped in this repository).",
    actorExamples: "Companies, tenants, enterprise domains, partner/requester organizations.",
  },
  individuals: {
    layer: "Application-side",
    whatItIs: "Sovereign persons / human actors with scoped memory and data relationships.",
    whyItMatters:
      "Individuals keep scoped, consented relationships; individual data is never sold unrestrictedly.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for individual-facing apps like Otzar (not shipped in this repository).",
    actorExamples: "Sovereign persons / human actors with consent-governed memory.",
  },
  employees: {
    layer: "Application-side",
    whatItIs:
      "Enterprise workforce actors, scoped by role, responsibility, permissions, and organizational context.",
    whyItMatters: "Supports application-side orchestration without collapsing role boundaries.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for workforce apps like Otzar (not shipped in this repository).",
    actorExamples: "Role-scoped enterprise workforce actors and AI teammates.",
  },
  education: {
    layer: "Application-side",
    whatItIs: "Educators and students as application-side domain actors.",
    whyItMatters:
      "They are not raw Foundation admin records; access is scoped by role, institution, and guardian/policy where relevant.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for education apps like Otzar (not shipped in this repository).",
    actorExamples: "Educators, students, institutions, guardians.",
  },
  governments: {
    layer: "Application-side",
    whatItIs: "Regulator and public-sector entities with scoped access.",
    whyItMatters:
      "Scoped access — not privileged unrestricted access. Consent, policy, audit, and role boundaries are preserved.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for public-sector apps like Otzar (not shipped in this repository).",
    actorExamples: "Regulators, public-sector institutions, credentialed auditors.",
  },
  devices: {
    layer: "Application-side",
    whatItIs:
      "Non-human entities — devices and robotics — with memory wallets and scoped capability channels.",
    whyItMatters:
      "Device/robot context is governed through entity identity and permissioned capability relationships.",
    foundationRelation:
      "A domain view over governed entities in the Foundation Entity Registry — not a separate Foundation substrate.",
    otzarRelation:
      "Application-readiness preview for device/robotics apps like Otzar (not shipped in this repository).",
    actorExamples: "Devices, robots, and automated non-human entities.",
  },
};
