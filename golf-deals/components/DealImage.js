import { categoryFor } from "@/lib/config";

// Shows the deal photo, or a branded placeholder when there isn't one.
export default function DealImage({ deal, className = "" }) {
  const cat = categoryFor(deal.category);
  if (deal.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={deal.image_url}
        alt={deal.title}
        loading="lazy"
        className={`h-full w-full bg-white object-contain p-3 ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 text-white ${className}`}
      style={{ background: `linear-gradient(135deg, ${cat.color}, #0d3a23)` }}
      role="img"
      aria-label={deal.title}
    >
      <svg viewBox="0 0 64 64" className="h-16 w-16 opacity-90" aria-hidden="true">
        <circle cx="32" cy="34" r="20" fill="#fff" />
        {[[24, 28], [32, 26], [40, 28], [26, 36], [34, 35], [41, 38], [30, 43], [37, 44]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#d6d3d1" />
        ))}
      </svg>
      <span className="px-3 text-center text-xs font-semibold uppercase tracking-wider opacity-80">{cat.label}</span>
    </div>
  );
}
