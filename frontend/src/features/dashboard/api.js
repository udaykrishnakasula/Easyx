import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/dashboard")).data,
  });
}

export function useWallet() {
  return useQuery({ queryKey: ["wallet"], queryFn: async () => (await api.get("/wallet")).data });
}

export function useInvestments(planKey) {
  return useQuery({
    queryKey: ["investments", planKey || "all"],
    queryFn: async () =>
      (await api.get("/investments", { params: planKey ? { plan_key: planKey } : {} })).data,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => (await api.get("/transactions")).data,
  });
}

export function useBuyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ planKey }) => {
      const idempotency_key =
        (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
        `${planKey}-${Date.now()}-${Math.random()}`;
      return (await api.post("/investments", { plan_key: planKey, idempotency_key })).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["investments"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export const money = (v) => `$${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
