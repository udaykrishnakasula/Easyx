import React from "react";
import { Loader2, Lock, Check } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { money, useBuyPlan } from "./api";
import { apiError } from "@/lib/api";

export default function BuyPlanDialog({ plan, open, onOpenChange, walletBalance }) {
  const buy = useBuyPlan();
  const price = Number(plan.price);
  const available = Number(walletBalance ?? 0);
  const insufficient = available < price;

  const onBuy = async () => {
    try {
      await buy.mutateAsync({ planKey: plan.key });
      toast.success(`Purchased 1 ${plan.name} card for ${money(plan.price)}`);
      onOpenChange(false);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (err?.response?.status === 402 && detail?.code === "insufficient_balance") {
        toast.error("Insufficient wallet balance.");
      } else {
        toast.error(apiError(err, "Could not complete the investment."));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12101c] border-white/10 text-white sm:max-w-md" data-testid={`buy-dialog-${plan.key}`}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{plan.name} Plan</DialogTitle>
          <DialogDescription className="text-white/60">
            Fixed investment — 1 card = 1 investment. No custom amount.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-sm">
          <Row label="Investment" value={money(plan.price)} strong />
          <Row label="Lock period" value={`${plan.lock_days} days`} />
          <Row label="Profit" value={`${money(plan.profit_amount)} (${plan.profit_percentage}%)`} />
          <Row label="Maturity" value={money(plan.maturity_amount)} strong accent />
        </div>

        {insufficient && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm" data-testid={`buy-insufficient-${plan.key}`}>
            <div className="flex justify-between"><span className="text-white/70">Required</span><span className="font-semibold">{money(plan.price)}</span></div>
            <div className="flex justify-between"><span className="text-white/70">Available</span><span className="font-semibold">{money(available)}</span></div>
            <div className="mt-1 font-semibold text-red-300">Insufficient wallet balance.</div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onBuy}
            disabled={insufficient || buy.isPending}
            data-testid={`buy-confirm-${plan.key}`}
            className="w-full rounded-full bg-white text-black hover:bg-white/90 h-11 font-semibold disabled:opacity-50"
          >
            {buy.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : insufficient ? (
              <><Lock className="mr-2 h-4 w-4" /> Insufficient balance</>
            ) : (
              <><Check className="mr-2 h-4 w-4" /> BUY {plan.name.toUpperCase()} — {money(plan.price)}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className={`${strong ? "font-bold" : "font-medium"} ${accent ? "text-emerald-300" : "text-white"}`}>{value}</span>
    </div>
  );
}
