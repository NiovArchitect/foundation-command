import { useQuery } from "@tanstack/react-query";
import { mockConsoleApi } from "@/mock/mockConsoleApi";
import type {
  ConsoleAuditQuery,
  ConsoleBreakGlassQuery,
  ConsoleEntityQuery,
  ConsoleEscalationQuery,
} from "@/types/console";

export const useOverview = () =>
  useQuery({ queryKey: ["console", "overview"], queryFn: () => mockConsoleApi.getOverview() });

export const useAudit = (q: ConsoleAuditQuery = {}) =>
  useQuery({ queryKey: ["console", "audit", q], queryFn: () => mockConsoleApi.getAudit(q) });

export const useEntities = (q: ConsoleEntityQuery = {}) =>
  useQuery({ queryKey: ["console", "entities", q], queryFn: () => mockConsoleApi.getEntities(q) });

export const useBreakGlassGrants = (q: ConsoleBreakGlassQuery = {}) =>
  useQuery({
    queryKey: ["console", "break-glass", q],
    queryFn: () => mockConsoleApi.getBreakGlassGrants(q),
  });

export const useEscalations = (q: ConsoleEscalationQuery = {}) =>
  useQuery({
    queryKey: ["console", "escalations", q],
    queryFn: () => mockConsoleApi.getEscalations(q),
  });

export const useReports = () =>
  useQuery({ queryKey: ["console", "reports"], queryFn: () => mockConsoleApi.getReports() });

export const useReport = (report_id: string) =>
  useQuery({
    queryKey: ["console", "report", report_id],
    queryFn: () => mockConsoleApi.getReportById(report_id),
  });
