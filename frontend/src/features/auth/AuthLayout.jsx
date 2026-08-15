import React from "react";
import { Link } from "react-router-dom";

// Shared shell for the auth screens. Matches the EasyX dark / lavender identity
// without touching the locked landing components.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full bg-[#0d0b14] text-white relative overflow-hidden font-body">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(150,120,255,0.25) 0%, rgba(13,11,20,0) 60%), radial-gradient(50% 40% at 100% 100%, rgba(120,200,255,0.18) 0%, rgba(13,11,20,0) 60%)",
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2" data-testid="auth-brand">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black font-display font-extrabold">E</span>
              <span className="font-display text-2xl font-extrabold tracking-tight">Easyx</span>
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
          </div>
          {footer ? <div className="mt-6 text-center text-sm text-white/60">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
