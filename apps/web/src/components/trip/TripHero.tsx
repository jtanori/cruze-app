"use client";

interface TripHeroProps {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
}

/**
 * TR-HERO-01 — reusable hero block: eyebrow + Sora display title + Inter body.
 * Canon T01 tokens: eyebrow text-xs uppercase, title text-3xl, body text-base.
 * T01 passes no eyebrow.
 */
export function TripHero({ eyebrow, title, body, className = "" }: TripHeroProps) {
  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      {eyebrow && (
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display font-bold text-3xl leading-tight text-ink">
        {title}
      </h1>
      {body && (
        <p className="font-sans text-base leading-relaxed text-faint text-balance">
          {body}
        </p>
      )}
    </div>
  );
}
