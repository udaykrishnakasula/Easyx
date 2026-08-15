import React from "react";
import { Loader2, Wallet as WalletIcon } from "lucide-react";

import { useDashboard, money } from "./api";
import PlanCard from "./PlanCard";

export default function DashboardHome() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-white/60" /></div>;
  }
  if (isError || !data) {
    return <div className="py-24 text-center text-white/60">Could not load your dashboard. Please refresh.</div>;
  }

  const { user, wallet, plans, totals } = data;

  return (
    <div data-testid="dashboard-home">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Welcome, {user.name?.split(" ")[0]}</h1>
        <p className="text-white/55 text-sm">Grow your USDT with EasyX investment plans.</p>
      </div>

      {/* Summary strip */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-testid="summary-wallet">
          <div className="flex items-center gap-2 text-white/50 text-xs"><WalletIcon className="h-4 w-4" /> Wallet balance</div>
          <div className="mt-1 font-display text-2xl font-bold">{money(wallet.available_balance)}</div>
          <div className="text-xs text-white/40">{wallet.currency}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-white/50 text-xs">Active investments</div>
          <div className="mt-1 font-display text-2xl font-bold">{totals.active_investments}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-white/50 text-xs">Total invested</div>
          <div className="mt-1 font-display text-2xl font-bold">{money(wallet.total_invested)}</div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Investment plans</h2>
        <span className="text-xs text-white/45">1 card = 1 investment</span>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((p) => (
          <PlanCard key={p.key} plan={p} userName={user.name} walletBalance={wallet.available_balance} />
        ))}
      </div>
    </div>
  );
}
