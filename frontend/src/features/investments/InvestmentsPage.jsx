import React from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { PiggyBank } from "lucide-react";

import { useInvestments, money } from "@/features/dashboard/api";
import { PageHeading, EasyXCard, EasyXStatusBadge, EasyXLoader, EasyXEmptyState } from "@/design/EasyX";

export default function InvestmentsPage() {
  const [params] = useSearchParams();
  const planKey = params.get("plan") || undefined;
  const { data, isLoading } = useInvestments(planKey);

  return (
    <div data-testid="investments-page">
      <PageHeading
        title={`Investments${planKey ? ` — ${planKey}` : ""}`}
        subtitle="Each card is a separate investment."
        icon={PiggyBank}
      />

      {isLoading ? (
        <EasyXLoader />
      ) : !data || data.length === 0 ? (
        <div className="mt-8">
          <EasyXEmptyState icon={PiggyBank} title="No investments yet" note="Unlock a plan from the dashboard to get started." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((inv) => (
            <EasyXCard key={inv.id} hover data-testid={`investment-${inv.id}`}>
              <div className="flex items-center justify-between">
                <span className="ex-eyebrow">{inv.plan_name}</span>
                <EasyXStatusBadge status={inv.status} />
              </div>
              <div className="mt-2 ex-display text-2xl font-extrabold text-white">{money(inv.principal)}</div>
              <div className="mt-3 grid grid-cols-2 gap-y-2.5 text-sm">
                <Cell label="Profit" value={money(inv.profit_amount)} accent />
                <Cell label="Maturity" value={money(inv.maturity_amount)} />
                <Cell label="Invested on" value={inv.start_at ? dayjs(inv.start_at).format("DD MMM YYYY") : "—"} />
                <Cell label="Matures on" value={inv.maturity_at ? dayjs(inv.maturity_at).format("DD MMM YYYY") : "—"} />
                <Cell label="Lock period" value={`${inv.lock_days} days`} />
                <Cell label="Remaining" value={inv.status === "active" ? `${inv.remaining_days} days` : "—"} />
              </div>
              <div className="mt-3 text-[11px] text-ex-muted/60">ID: {inv.id}</div>
            </EasyXCard>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, accent }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-ex-muted/70">{label}</div>
      <div className={`font-semibold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
