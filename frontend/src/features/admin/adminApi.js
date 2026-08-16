import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAdminDeposits(status) {
  return useQuery({
    queryKey: ["admin-deposits", status || "all"],
    queryFn: async () =>
      (await api.get("/admin/deposits", { params: status ? { status } : {} })).data,
    refetchInterval: 30000,
  });
}

export function useApproveDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved_amount, note }) =>
      (await api.post(`/admin/deposits/${id}/approve`, { approved_amount, note })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-deposits"] }),
  });
}

export function useRejectDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }) =>
      (await api.post(`/admin/deposits/${id}/reject`, { note })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-deposits"] }),
  });
}

export function useAdminDepositSettings() {
  return useQuery({
    queryKey: ["admin-deposit-settings"],
    queryFn: async () => (await api.get("/admin/settings/deposit")).data,
  });
}

export function useSaveDepositAddresses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ trc20, bep20 }) =>
      (await api.put("/admin/settings/deposit", { trc20, bep20 })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deposit-settings"] });
      qc.invalidateQueries({ queryKey: ["deposit-config"] });
    },
  });
}

export function useAdminKyc(status) {
  return useQuery({
    queryKey: ["admin-kyc", status || "all"],
    queryFn: async () =>
      (await api.get("/admin/kyc", { params: status ? { status } : {} })).data,
    refetchInterval: 30000,
  });
}

export function useApproveKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => (await api.post(`/admin/kyc/${id}/approve`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });
}

export function useRejectKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => (await api.post(`/admin/kyc/${id}/reject`, { reason })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });
}

// Fetch a protected KYC document as an object URL (admin-authenticated).
export async function fetchAdminKycDocUrl(docId) {
  const res = await api.get(`/admin/kyc/documents/${docId}`, { responseType: "blob" });
  return URL.createObjectURL(res.data);
}

export function useAdminReferrals() {
  return useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => (await api.get("/admin/referrals")).data,
    refetchInterval: 30000,
  });
}

/* ------------------------- Users (view / suspend) ------------------------- */
export function useAdminUsers({ status, q } = {}) {
  return useQuery({
    queryKey: ["admin-users", status || "all", q || ""],
    queryFn: async () => {
      const params = {};
      if (status) params.status = status;
      if (q) params.q = q;
      return (await api.get("/admin/users", { params })).data;
    },
    refetchInterval: 30000,
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) =>
      (await api.post(`/admin/users/${id}/suspend`, { reason })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUnsuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => (await api.post(`/admin/users/${id}/unsuspend`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

/* ------------------------- Maintenance mode ------------------------- */
export function useAdminMaintenance() {
  return useQuery({
    queryKey: ["admin-maintenance"],
    queryFn: async () => (await api.get("/admin/maintenance")).data,
  });
}

export function useSaveMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch) => (await api.put("/admin/maintenance", patch)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-maintenance"] });
      qc.invalidateQueries({ queryKey: ["public-maintenance"] });
    },
  });
}

/* ------------------------- Audit logs ------------------------- */
export function useAdminAuditLogs({ action, entity_type } = {}) {
  return useQuery({
    queryKey: ["admin-audit-logs", action || "all", entity_type || "all"],
    queryFn: async () => {
      const params = {};
      if (action) params.action = action;
      if (entity_type) params.entity_type = entity_type;
      return (await api.get("/admin/audit-logs", { params })).data;
    },
    refetchInterval: 30000,
  });
}

/* Public maintenance status (no auth) — used by auth screens. */
export function usePublicMaintenance() {
  return useQuery({
    queryKey: ["public-maintenance"],
    queryFn: async () => (await api.get("/maintenance")).data,
    refetchInterval: 60000,
  });
}
