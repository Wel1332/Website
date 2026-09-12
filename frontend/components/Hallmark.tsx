/* The house mark. A silversmith stamps a hallmark to say a piece is real and
   it's yours — the same claim this store makes about a file. Drawn rather than
   imported so the ring text always carries the live brand name. */
export default function Hallmark({
  brand,
  motto = "buy once · keep forever",
  className = "",
}: {
  brand: string;
  motto?: string;
  className?: string;
}) {
  const initial = brand.trim().charAt(0).toUpperCase() || "·";

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`${brand} maker's mark — ${motto}`}
    >
      {/* Struck rings */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-accent)" strokeWidth="1" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="var(--color-border-hover)" strokeWidth="1" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.55" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="var(--color-border-hover)" strokeWidth="1" />

      <defs>
        {/* Upper arc reads over the top; lower arc is drawn left-to-right
            through the bottom so its text sits upright too. */}
        <path id="hm-arc-top" d="M 24,100 A 76,76 0 0 1 176,100" fill="none" />
        <path id="hm-arc-bottom" d="M 30,100 A 70,70 0 0 0 170,100" fill="none" />
      </defs>

      <text
        className="font-mono"
        fill="var(--color-text)"
        fontSize="11.5"
        fontWeight="500"
        letterSpacing="4"
      >
        <textPath href="#hm-arc-top" startOffset="50%" textAnchor="middle">
          {brand.toUpperCase()}
        </textPath>
      </text>

      <text
        className="font-mono"
        fill="var(--color-accent)"
        fontSize="8.5"
        letterSpacing="2.6"
      >
        <textPath href="#hm-arc-bottom" startOffset="50%" textAnchor="middle">
          {motto.toUpperCase()}
        </textPath>
      </text>

      {/* Assay marks divide the ring at the shoulders. */}
      <path d="M 22,100 l 5,-5 5,5 -5,5 z" fill="var(--color-accent)" />
      <path d="M 168,100 l 5,-5 5,5 -5,5 z" fill="var(--color-accent)" />

      {/* Monogram, struck into the face */}
      <text
        className="font-display"
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="62"
        fontWeight="800"
        letterSpacing="-3"
        fill="var(--color-text)"
      >
        {initial}
      </text>
      <line x1="82" y1="128" x2="118" y2="128" stroke="var(--color-accent)" strokeWidth="1.5" />
    </svg>
  );
}
