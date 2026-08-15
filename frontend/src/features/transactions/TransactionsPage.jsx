import React from "react";
import { Loader2, ReceiptText } from "lucide-react";
import dayjs from "dayjs";

import { useTransactions, money } from "@/features/dashboard/api";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();
  return (
    <div data-testid="transactions-page">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><ReceiptText className="h-6 w-6" /> Transactions</h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-white/60" /></div>
      ) : !data || data.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/50">No transactions yet.</div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] text-white/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Balance after</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 capitalize">{t.type.replace(/_/g, " ")}</td>
                  <td className={`px-4 py-3 font-semibold ${t.direction === "credit" ? "text-emerald-300" : "text-red-300"}`}>
                    {t.direction === "credit" ? "+" : "-"}{money(t.amount)}
                  </td>
                  <td className="px-4 py-3">{money(t.balance_after)}</td>
                  <td className="px-4 py-3 capitalize text-white/70">{t.status}</td>
                  <td className="px-4 py-3 text-white/60">{dayjs(t.created_at).format("DD MMM YYYY, HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
