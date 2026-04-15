"use client";

import { useMemo } from "react";

const COLORS = ["#fcd34d", "#f97316", "#ec4899", "#22d3ee", "#a78bfa", "#fef3c7"];

export function Confetti({ count = 24 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 180 + Math.random() * 160;
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          r: `${Math.random() * 720 - 360}deg`,
          color: COLORS[i % COLORS.length],
          delay: `${Math.random() * 0.15}s`,
        };
      }),
    [count]
  );

  return (
    <div className="confetti-burst" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              background: p.color,
              animationDelay: p.delay,
              "--dx": p.dx,
              "--dy": p.dy,
              "--r": p.r,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
