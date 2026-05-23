export const GLOSSARY: Record<string, string> = {
  "Break-Glass":
    "Emergency, time-boxed access path for exceptional situations. In P0 this Console only displays grant metadata; justification is intentionally excluded.",
  "Dual-Control":
    "Governance pattern requiring more than one authorized actor or approval path before high-risk actions proceed.",
  "Scoped Proof":
    "Compliance or regulator-facing evidence surface with limited, permissioned visibility. It is not full Foundation Console access.",
  "Memory Capsule":
    "A governed memory/data unit. P0 Console displays metadata and counts only, never raw capsule content.",
  "Permissioned Intelligence Exchange":
    "Future/partial market surface for governed intelligence exchange. P0 uses mock/future readiness only and must not display live pricing.",
  can_admin_niov:
    "Current backend capability required to access P0 Console endpoints.",
  ConsoleOperatorRole:
    "Future dedicated Console role model. Not implemented in P0.",
  Readiness:
    "Where a surface stands: LIVE (backed by real data), PARTIAL (partially wired), MOCK (only mock data), FUTURE (not implemented).",
  "Audit Chain":
    "Hash-chained audit event log. Each event references the prior hash for tamper-evidence.",
  "Entity Registry":
    "Metadata-level registry of Foundation-supported entities and wallets. Shows entity state, domain, wallet, sessions, capabilities, relationships — never private content.",
  "Foundation-supported actor":
    "An actor type served by the Foundation through applications, scoped portals, wallets, APIs, or governed event surfaces.",
  "Substrate-wide Console access":
    "Full operator-level visibility into Foundation control-plane metadata. P0 restricts this to authorized NIOV operators.",
};
