import { useQuery } from "@tanstack/react-query";
import { consoleApi } from "@/api/consoleApi";
import type {
  ConsoleAuditQuery,
  ConsoleBreakGlassQuery,
  ConsoleEntityQuery,
  ConsoleEscalationQuery,
} from "@/types/console";

export const useOverview = () =>
  useQuery({ queryKey: ["console", "overview"], queryFn: () => consoleApi.getOverview() });

export const useAudit = (q: ConsoleAuditQuery = {}) =>
  useQuery({ queryKey: ["console", "audit", q], queryFn: () => consoleApi.getAudit(q) });

export const useEntities = (q: ConsoleEntityQuery = {}) =>
  useQuery({ queryKey: ["console", "entities", q], queryFn: () => consoleApi.getEntities(q) });

export const useBreakGlassGrants = (q: ConsoleBreakGlassQuery = {}) =>
  useQuery({
    queryKey: ["console", "break-glass", q],
    queryFn: () => consoleApi.getBreakGlassGrants(q),
  });

export const useEscalations = (q: ConsoleEscalationQuery = {}) =>
  useQuery({
    queryKey: ["console", "escalations", q],
    queryFn: () => consoleApi.getEscalations(q),
  });

export const useReports = () =>
  useQuery({ queryKey: ["console", "reports"], queryFn: () => consoleApi.getReports() });

export const useReport = (report_id: string) =>
  useQuery({
    queryKey: ["console", "report", report_id],
    queryFn: () => consoleApi.getReportById(report_id),
  });
