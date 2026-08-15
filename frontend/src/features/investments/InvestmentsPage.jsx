import React from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { Loader2, PiggyBank } from "lucide-react";

import { useInvestments, money } from "@/features/dashboard/api";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLE = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  matured: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function InvestmentsPage() {
  const [params] = useSearchParams();
  const planKey = params.get("plan") || undefined;
  const { data, isLoading } = useInvestments(planKey);

  return (
    <div data-testid="investments-page">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2">
        <PiggyBank className="h-6 w-6" /> Investments{planKey ? ` — ${planKey}` : ""}
      </h1>
      <p className="text-white/55 text-sm mt-1">Each card is a separate investment.</p>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-white/60" /></div>
      ) : !data || data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/50">
          No investments yet. Unlock a plan from the dashboard to get started.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((inv) => (
            <div key={inv.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5" data-testid={`investment-${inv.id}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-white/60">{inv.plan_name}</span>
                <Badge className={`border ${STATUS_STYLE[inv.status] || ""}`}>{inv.status}</Badge>
              </div>
              <div className="mt-2 font-display text-2xl font-bold">{money(inv.principal)}</div>
              <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <Cell label="Profit" value={money(inv.profit_amount)} accent />
                <Cell label="Maturity" value={money(inv.maturity_amount)} />
                <Cell label="Invested on" value={inv.start_at ? dayjs(inv.start_at).format("DD MMM YYYY") : "—"} />
                <Cell label="Matures on" value={inv.maturity_at ? dayjs(inv.maturity_at).format("DD MMM YYYY") : "—"} />
                <Cell label="Lock period" value={`${inv.lock_days} days`} />
                <Cell label="Remaining" value={inv.status === "active" ? `${inv.remaining_days} days` : "—"} />
              </div>
              <div className="mt-3 text-[11px] text-white/35">ID: {inv.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, accent }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/45">{label}</div>
      <div className={`font-semibold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
