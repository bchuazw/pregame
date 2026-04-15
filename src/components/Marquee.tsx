const MARQUEE_ITEMS = [
  "LIVE HYPE LINE",
  "★",
  "JOB INTERVIEW IN 5",
  "★",
  "QUITTING TOMORROW",
  "★",
  "FIRST DATE NERVES",
  "★",
  "HARD CONVERSATION",
  "★",
  "MARATHON MORNING",
  "★",
  "ASKING HER OUT",
  "★",
  "BIG PRESENTATION",
  "★",
  "MOVING ACROSS THE COUNTRY",
  "★",
  "WALKING AWAY FROM IT",
  "★",
];

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative border-y border-hype-400/30 bg-gradient-to-r from-hype-500/10 via-flame-500/10 to-cyber-400/10 overflow-hidden marquee-mask">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((it, i) => (
          <span
            key={i}
            className="px-5 py-2 text-xs md:text-sm font-extrabold tracking-[0.25em] text-hype-200"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
