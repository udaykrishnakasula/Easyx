import React, { useState } from "react";
import { Lock, ArrowRight, Loader2, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PLAN_THEME } from "./plan-theme";
import { money } from "./api";
import BuyPlanDialog from "./BuyPlanDialog";

export default function PlanCard({ plan, userName, walletBalance }) {
  const theme = PLAN_THEME[plan.key] || PLAN_THEME.silver;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${theme.grad} ring-1 ${theme.ring} p-5 min-h-[260px] flex flex-col`}
        data-testid={`dash-plan-${plan.key}`}
        data-unlocked={plan.unlocked ? "true" : "false"}
        style={{ boxShadow: `0 20px 50px -24px ${theme.glow}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.text}`}>{plan.name}</span>
          {plan.unlocked ? (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${theme.chip}`}>UNLOCKED</span>
          ) : (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/60">LOCKED</span>
          )}
        </div>

        {plan.unlocked ? (
          <UnlockedBody plan={plan} userName={userName} onView={() => navigate(`/app/investments?plan=${plan.key}`)} onBuyMore={() => setOpen(true)} />
        ) : (
          <LockedBody plan={plan} onUnlock={() => setOpen(true)} />
        )}
      </div>

      <BuyPlanDialog plan={plan} open={open} onOpenChange={setOpen} walletBalance={walletBalance} />
    </>
  );
}

function LockedBody({ plan, onUnlock }) {
  return (
    <div className="relative flex-1">
      {/* Blurred, unreadable info behind the glass */}
      <div className="pointer-events-none select-none blur-md opacity-60 mt-4" aria-hidden="true">
        <div className="font-display text-3xl font-extrabold text-white">{money(plan.price)}</div>
        <div className="mt-3 space-y-2 text-sm text-white/80">
          <div>{plan.lock_days} days lock</div>
          <div>Profit {plan.profit_percentage}%</div>
          <div>Maturity {money(plan.maturity_amount)}</div>
          <div>Expected profit {money(plan.profit_amount)}</div>
        </div>
      </div>
      {/* Glassmorphism overlay + centered lock */}
      <button
        onClick={onUnlock}
        data-testid={`dash-plan-unlock-${plan.key}`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 transition hover:bg-white/[0.1]"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
          <Lock className="h-6 w-6 text-white" />
        </span>
        <span className="text-sm font-semibold text-white">Tap to unlock</span>
        <span className="text-xs text-white/60">Invest to reveal this plan</span>
      </button>
    </div>
  );
}

function UnlockedBody({ plan, userName, onView, onBuyMore }) {
  return (
    <div className="mt-2 flex flex-1 flex-col">
      <p className="text-xs text-white/60">Welcome, {userName}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-2xl font-extrabold text-white">{plan.cards}</span>
        <span className="text-sm text-white/70">Card{plan.cards === 1 ? "" : "s"}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
        <Stat label="Total invested" value={money(plan.total_invested)} />
        <Stat label="Active" value={plan.active_investments} />
        <Stat label="Expected profit" value={money(plan.expected_profit)} accent />
        <Stat label="Expected maturity" value={money(plan.expected_maturity)} />
        <Stat label="Next maturity" value={plan.next_maturity ? dayjs(plan.next_maturity).format("DD MMM YYYY") : "—"} full />
      </div>
      <div className="mt-auto flex gap-2 pt-4">
        <Button onClick={onView} data-testid={`dash-view-${plan.key}`}
          className="flex-1 rounded-full bg-white text-black hover:bg-white/90 h-9 text-sm font-semibold">
          View Investments <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <Button onClick={onBuyMore} variant="outline" data-testid={`dash-buymore-${plan.key}`}
          className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 h-9 text-sm">
          Buy
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-[11px] uppercase tracking-wide text-white/45">{label}</div>
      <div className={`font-semibold ${accent ? "text-emerald-300" : "text-white"} flex items-center gap-1`}>
        {accent && <TrendingUp className="h-3.5 w-3.5" />}{value}
      </div>
    </div>
  );
}

export { Loader2 };
