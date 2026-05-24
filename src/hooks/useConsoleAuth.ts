import { useSyncExternalStore } from "react";
import {
  subscribeConsoleAuth,
  getConsoleAuthSnapshot,
  type ConsoleAuthSnapshot,
} from "@/api/consoleAuth";

/**
 * Reactive view of the in-memory Console auth/verification state. Re-renders the
 * caller whenever the token or its backend-verification status changes. Reads
 * from the DOM-free store in `consoleAuth`; never touches persistent storage.
 */
export function useConsoleAuth(): ConsoleAuthSnapshot {
  return useSyncExternalStore(subscribeConsoleAuth, getConsoleAuthSnapshot, getConsoleAuthSnapshot);
}
