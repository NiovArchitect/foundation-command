import * as React from "react";

export type ThemeMode = "dark" | "light" | "system";
const KEY = "niov-console-theme";

function applyMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

export function useTheme() {
  const [mode, setModeState] = React.useState<ThemeMode>("dark");

  React.useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) as
      | ThemeMode
      | null;
    const initial: ThemeMode = stored === "light" || stored === "system" ? stored : "dark";
    setModeState(initial);
    applyMode(initial);
  }, []);

  React.useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyMode("system");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [mode]);

  const setMode = React.useCallback((m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(KEY, m);
    } catch {}
    applyMode(m);
  }, []);

  return { mode, setMode };
}
