import React from "react";
import { User, Mail, Phone, Hash, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const rows = [
    { icon: User, label: "Full name", value: user?.name },
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Phone, label: "Phone", value: user?.phone },
    { icon: Hash, label: "Referral code", value: user?.referral_code },
    { icon: ShieldCheck, label: "KYC status", value: (user?.kyc_status || "none").toUpperCase() },
  ];
  return (
    <div data-testid="profile-page">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <div className="mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] divide-y divide-white/5">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon className="h-4 w-4 text-white/70" /></span>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-white/45">{label}</div>
              <div className="font-medium">{value || "—"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
