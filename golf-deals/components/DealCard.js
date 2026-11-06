import Link from "next/link";
import DealImage from "./DealImage";
import Countdown from "./Countdown";
import GetDealButton from "./GetDealButton";
import { categoryFor } from "@/lib/config";
import { discountPercent, formatPrice } from "@/lib/format";

export default function DealCard({ deal }) {
  const pct = discountPercent(deal.price, deal.original_price);
  const detailHref = `/deal/?id=${encodeURIComponent(deal.id)}`;

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <DealImage deal={deal} className="transition duration-300 group-hover:scale-105" />
        {pct > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-flag px-2.5 py-1 text-sm font-bold text-white shadow">
            {pct}% OFF
          </span>
        )}
        {deal.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
            ★ Hot
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
          <span className="font-semibold uppercase tracking-wide text-turf-700">{categoryFor(deal.category).label}</span>
          {deal.retailer && <span className="truncate">at {deal.retailer}</span>}
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug text-stone-900">
          <Link href={detailHref} className="hover:text-turf-700">
            {deal.title}
          </Link>
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold text-stone-900">{formatPrice(deal.price)}</span>
          {pct > 0 && <span className="text-sm text-stone-400 line-through">{formatPrice(deal.original_price)}</span>}
        </div>

        <div className="min-h-5 text-sm">
          {deal.expires_at ? <Countdown expiresAt={deal.expires_at} /> : <span className="text-stone-400">No expiry</span>}
        </div>

        <GetDealButton deal={deal} className="mt-1 w-full" />
      </div>
    </article>
  );
}
