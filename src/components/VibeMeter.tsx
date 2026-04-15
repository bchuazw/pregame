"use client";

import { useEffect, useState } from "react";

export function EnergyMeter({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-white/60">
        <span className="uppercase tracking-widest">{label}</span>
        <span className="tabular-nums text-white/80">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full vibe-meter-fill transition-[width] duration-[1400ms] ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}
