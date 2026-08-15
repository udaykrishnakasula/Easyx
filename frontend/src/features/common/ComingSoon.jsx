import React from "react";
import { Construction } from "lucide-react";

export default function ComingSoon({ title, note }) {
  return (
    <div data-testid={`coming-soon-${title.toLowerCase()}`}>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
        <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-white/10">
          <Construction className="h-6 w-6 text-white/70" />
        </span>
        <p className="mt-4 font-medium text-white">{title} is coming soon</p>
        <p className="mt-1 text-sm text-white/50">{note || "This section will be available in an upcoming update."}</p>
      </div>
    </div>
  );
}
