import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Wallet, PiggyBank, ArrowDownToLine, ArrowUpFromLine,
  Users, ShieldCheck, Bell, ReceiptText, User, Lock, LogOut, Menu,
} from "lucide-react";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/investments", label: "Investments", icon: PiggyBank },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/app/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/app/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/app/referral", label: "Referral", icon: Users },
  { to: "/app/kyc", label: "KYC", icon: ShieldCheck },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/security", label: "Security", icon: Lock },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1" data-testid="dashboard-nav">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              isActive ? "bg-white text-black font-semibold" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-black font-display font-extrabold">E</span>
      <span className="font-display text-xl font-extrabold tracking-tight text-white">Easyx</span>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0d0b14] text-white font-body">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-white/10 bg-[#0f0d18] p-4">
        <Brand />
        <div className="mt-6 flex-1 overflow-y-auto"><NavItems /></div>
        <Button onClick={handleLogout} variant="outline"
          className="mt-4 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10" data-testid="logout-button">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0d0b14]/90 backdrop-blur-xl px-4 py-3">
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="mobile-nav-trigger">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-[#0f0d18] border-white/10 p-4">
            <Brand />
            <div className="mt-6"><NavItems onNavigate={() => setOpenMobile(false)} /></div>
            <Button onClick={handleLogout} variant="outline"
              className="mt-4 w-full rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </SheetContent>
        </Sheet>
        <Brand />
        <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center text-xs font-semibold">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
