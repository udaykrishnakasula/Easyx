import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LOGOUT } from "@/constants/testIds/auth";

// Product facts (static plan catalog). NOT user financial data.
const PLANS = [
  { key: "silver", name: "Silver", invest: "$300", profit: "60%", maturity: "$480", lock: "60 days" },
  { key: "gold", name: "Gold", invest: "$1,000", profit: "60%", maturity: "$1,600", lock: "60 days" },
  { key: "platinum", name: "Platinum", invest: "$5,000", profit: "100%", maturity: "$10,000", lock: "60 days" },
  { key: "diamond", name: "Diamond", invest: "$10,000", profit: "100%", maturity: "$20,000", lock: "60 days" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0d0b14] text-white font-body" data-testid="dashboard-page">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black font-display font-extrabold">E</span>
            <span className="font-display text-xl font-extrabold tracking-tight">Easyx</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-white/60" data-testid="dashboard-user-name">{user?.name}</span>
            <Button onClick={handleLogout} variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 rounded-full"
              data-testid={LOGOUT.button}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">Welcome, {user?.name?.split(" ")[0] || "investor"} \uD83D\uDC4B</h1>
        <p className="mt-1 text-white/60">Your EasyX dashboard. More features are on the way.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard label="Wallet balance" value="Coming soon" hint="Wallet & ledger — next phase" />
          <InfoCard label="Active investments" value="Coming soon" hint="Invest engine — next phase" />
          <InfoCard label="KYC status" value={(user?.kyc_status || "none").toUpperCase()} hint="Required to withdraw" />
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Investment plans</h2>
          <p className="text-sm text-white/50">1 card = 1 investment. You will be able to purchase cards in the next phase.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <div key={p.key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5" data-testid={`plan-card-${p.key}`}>
                <div className="text-sm uppercase tracking-wide text-white/50">{p.name}</div>
                <div className="mt-2 font-display text-2xl font-bold">{p.invest}</div>
                <div className="mt-3 space-y-1 text-sm text-white/70">
                  <div className="flex justify-between"><span className="text-white/50">Profit</span><span>{p.profit}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Maturity</span><span>{p.maturity}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Lock</span><span>{p.lock}</span></div>
                </div>
                <Button disabled className="mt-4 w-full rounded-full bg-white/10 text-white/50" data-testid={`plan-invest-${p.key}`}>
                  Invest (soon)
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="font-display text-lg font-bold">Your referral code</h2>
          <p className="mt-1 text-sm text-white/60">Share this code — referral rewards arrive in a later phase.</p>
          <div className="mt-3 inline-flex items-center rounded-lg border border-white/15 bg-black/30 px-4 py-2 font-mono text-lg tracking-widest" data-testid="dashboard-referral-code">
            {user?.referral_code || "--------"}
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="text-sm text-white/50">{label}</div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-white/40">{hint}</div>
    </div>
  );
}
