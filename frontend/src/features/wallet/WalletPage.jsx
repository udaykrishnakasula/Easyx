import React from "react";
import { Loader2, Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import dayjs from "dayjs";

import { useWallet, useTransactions, money } from "@/features/dashboard/api";

export default function WalletPage() {
  const { data: wallet, isLoading } = useWallet();
  const { data: txns } = useTransactions();

  return (
    <div data-testid="wallet-page">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><WalletIcon className="h-6 w-6" /> Wallet</h1>

      {isLoading || !wallet ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-white/60" /></div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 p-5">
            <div className="text-white/60 text-xs">Available balance</div>
            <div className="mt-1 font-display text-3xl font-bold" data-testid="wallet-balance">{money(wallet.available_balance)}</div>
            <div className="text-xs text-white/45">{wallet.currency}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/60 text-xs">Total invested</div>
            <div className="mt-1 font-display text-2xl font-bold">{money(wallet.total_invested)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-white/60 text-xs">Total earned</div>
            <div className="mt-1 font-display text-2xl font-bold">{money(wallet.total_earned)}</div>
          </div>
        </div>
      )}

      <h2 className="mt-8 font-display text-lg font-bold">Recent transactions</h2>
      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/5">
        {!txns || txns.length === 0 ? (
          <div className="p-8 text-center text-white/45 text-sm">No transactions yet.</div>
        ) : (
          txns.slice(0, 15).map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 place-items-center rounded-full ${t.direction === "credit" ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                  {t.direction === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </span>
                <div>
                  <div className="text-sm font-medium capitalize">{t.type.replace(/_/g, " ")}</div>
                  <div className="text-[11px] text-white/40">{dayjs(t.created_at).format("DD MMM YYYY, HH:mm")}</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${t.direction === "credit" ? "text-emerald-300" : "text-red-300"}`}>
                {t.direction === "credit" ? "+" : "-"}{money(t.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
