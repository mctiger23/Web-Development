"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DealImage from "@/components/DealImage";
import Countdown from "@/components/Countdown";
import GetDealButton from "@/components/GetDealButton";
import { getDeal } from "@/lib/dealsApi";
import { SITE_NAME, categoryFor } from "@/lib/config";
import { dealStatus, discountPercent, formatPrice, savings } from "@/lib/format";

export default function DealDetail() {
  const id = useSearchParams().get("id");
  const [loaded, setLoaded] = useState({ id: null, deal: undefined });
  // Without an id there's nothing to load: treat it as "not found".
  const deal = !id ? null : loaded.id === id ? loaded.deal : undefined;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDeal(id)
      .then((d) => setLoaded({ id, deal: d }))
      .catch(() => setLoaded({ id, deal: null }));
  }, [id]);

  useEffect(() => {
    if (deal) document.title = `${deal.title} | ${SITE_NAME}`;
  }, [deal]);

  if (deal === undefined) {
    return <div className="mx-auto my-8 h-[28rem] w-full max-w-5xl animate-pulse rounded-2xl bg-stone-100" />;
  }

  if (!deal || dealStatus(deal) === "hidden" || dealStatus(deal) === "scheduled") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p className="mt-2 text-stone-600">This deal may have ended or been removed.</p>
        <Link href="/" className="btn btn-primary mt-6">
          See current deals
        </Link>
      </div>
    );
  }

  const expired = dealStatus(deal) === "expired";
  const pct = discountPercent(deal.price, deal.original_price);
  const saved = savings(deal.price, deal.original_price);
  const cat = categoryFor(deal.category);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: deal.title, url });
      } catch {}
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <nav className="mb-4 text-sm text-stone-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-turf-700">
          All deals
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/?category=${cat.slug}`} className="hover:text-turf-700">
          {cat.label}
        </Link>
      </nav>

      <div className="card grid overflow-hidden md:grid-cols-2">
        <div className="relative aspect-square bg-stone-100 md:aspect-auto md:min-h-[28rem]">
          <DealImage deal={deal} />
          {pct > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-flag px-3 py-1.5 font-bold text-white shadow">
              {pct}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-8">
          <div className="text-sm text-stone-500">
            {deal.brand && <span className="font-semibold text-turf-700">{deal.brand}</span>}
            {deal.brand && deal.retailer && " · "}
            {deal.retailer && <span>Sold by {deal.retailer}</span>}
          </div>

          <h1 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">{deal.title}</h1>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-4xl font-extrabold text-stone-900">{formatPrice(deal.price)}</span>
            {pct > 0 && (
              <>
                <span className="text-lg text-stone-400 line-through">{formatPrice(deal.original_price)}</span>
                <span className="rounded-md bg-turf-100 px-2 py-0.5 text-sm font-semibold text-turf-800">
                  You save {formatPrice(saved)}
                </span>
              </>
            )}
          </div>

          {deal.expires_at && (
            <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm">
              <Countdown expiresAt={deal.expires_at} />
            </div>
          )}

          {deal.coupon_code && (
            <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-turf-500 bg-turf-50 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-turf-700">Use code at checkout</p>
                <p className="font-mono text-lg font-bold">{deal.coupon_code}</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigator.clipboard?.writeText(deal.coupon_code)}
              >
                Copy
              </button>
            </div>
          )}

          {expired ? (
            <p className="rounded-xl bg-stone-100 px-4 py-3 text-center font-semibold text-stone-600">This deal has ended</p>
          ) : (
            <GetDealButton
              deal={deal}
              className="w-full py-3 text-base"
              label={deal.retailer ? `Get this deal at ${deal.retailer}` : "Get this deal"}
            />
          )}

          <button type="button" onClick={share} className="btn btn-ghost w-full">
            {copied ? "Link copied!" : "Share this deal"}
          </button>

          {deal.description && (
            <div className="border-t border-stone-200 pt-4">
              <h2 className="mb-2 font-semibold">About this deal</h2>
              <p className="whitespace-pre-line leading-relaxed text-stone-700">{deal.description}</p>
            </div>
          )}

          <p className="text-xs text-stone-400">
            Prices can change at any time. Please confirm the final price on the retailer&apos;s website.
          </p>
        </div>
      </div>
    </div>
  );
}
