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

export function useDepositConfig() {
  return useQuery({
    queryKey: ["deposit-config"],
    queryFn: async () => (await api.get("/deposits/config")).data,
  });
}

export function useMyDeposits() {
  return useQuery({
    queryKey: ["my-deposits"],
    queryFn: async () => (await api.get("/deposits")).data,
  });
}

export function useCreateDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ network, amount, tx_hash }) =>
      (await api.post("/deposits", { network, amount, tx_hash })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-deposits"] });
    },
  });
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ["notifications", unreadOnly ? "unread" : "all"],
    queryFn: async () =>
      (await api.get("/notifications", { params: unreadOnly ? { unread_only: true } : {} })).data,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => (await api.get("/notifications/unread-count")).data.count,
    refetchInterval: 60000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.post(`/notifications/${id}/read`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post("/notifications/read-all")).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

export function useBuyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ planKey, idempotencyKey }) => {
      // A STABLE key per purchase intent guarantees double-click / retry /
      // refresh of the SAME intent collapses to one investment on the backend.
      const idempotency_key =
        idempotencyKey ||
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

export function useReferralSummary() {
  return useQuery({
    queryKey: ["referral-summary"],
    queryFn: async () => (await api.get("/referrals/summary")).data,
  });
}

export const money = (v) => `$${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
