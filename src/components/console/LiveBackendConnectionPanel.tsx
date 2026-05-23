import * as React from "react";
import {
  setConsoleBearerToken,
  clearConsoleBearerToken,
  hasConsoleBearerToken,
} from "@/api/consoleAuth";
import { USE_MOCK } from "@/api/consoleConfig";
import { CommandCenterSection, StatusPill, WarningState } from "@/components/console";

/**
 * P0 / dev-only operator bridge for placing a `can_admin_niov` Bearer token into
 * the in-memory token holder so the future browser live smoke can authenticate.
 *
 * This is NOT a production login system: it never captures credentials, never
 * calls an auth endpoint, and never persists the token. The raw token is handed
 * straight to `setConsoleBearerToken` and the field is cleared — the component
 * keeps no copy of it and never displays or imports it back.
 */
export function LiveBackendConnectionPanel() {
  const [value, setValue] = React.useState("");
  const [tokenSet, setTokenSet] = React.useState(false);

  React.useEffect(() => {
    setTokenSet(hasConsoleBearerToken());
  }, []);

  const handleSet = () => {
    setConsoleBearerToken(value);
    setTokenSet(hasConsoleBearerToken());
    setValue(""); // never retain the raw token in component state
  };

  const handleClear = () => {
    clearConsoleBearerToken();
    setTokenSet(false);
  };

  const modeStatus = USE_MOCK
    ? "Mock mode active — no backend requests will be sent."
    : tokenSet
      ? "Live mode ready — Bearer token present in memory."
      : "Live mode selected — requests are blocked until a Bearer token is set.";

  return (
    <CommandCenterSection
      title="P0 Live Backend Token Bridge"
      description="Dev/P0-only operator bridge for a memory-only Bearer token."
      readiness="FUTURE"
    >
      <div className="flex flex-col gap-3">
        <WarningState message="Live backend mode requires a can_admin_niov Bearer token." />
        <WarningState message="This is not a production login system." />

        <ul className="flex list-disc flex-col gap-1 pl-5 text-[12px] text-muted-foreground">
          <li>The token is stored in memory only and clears on reload.</li>
          <li>Mock mode remains the default unless VITE_CONSOLE_USE_MOCK=false is set.</li>
          <li>Do not use production tokens in local smoke testing.</li>
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste can_admin_niov Bearer token"
            autoComplete="off"
            spellCheck={false}
            aria-label="Operator Bearer token"
            className="w-72 rounded-sm border border-border bg-surface-2 px-2 py-1 text-[12px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          <button
            type="button"
            onClick={handleSet}
            disabled={value.trim() === ""}
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-2 disabled:opacity-40"
          >
            Set token
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-surface-2"
          >
            Clear token
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={tokenSet ? "ok" : "neutral"}>
            {tokenSet ? "Token set: ••••••••••••" : "No token set"}
          </StatusPill>
          <StatusPill tone={USE_MOCK ? "info" : tokenSet ? "ok" : "warn"}>{modeStatus}</StatusPill>
        </div>
      </div>
    </CommandCenterSection>
  );
}
