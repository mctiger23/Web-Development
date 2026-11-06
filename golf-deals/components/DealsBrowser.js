"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DealCard from "./DealCard";
import { listLiveDeals } from "@/lib/dealsApi";
import { CATEGORIES, SORTS } from "@/lib/config";
import { discountPercent } from "@/lib/format";

function sortDeals(deals, sort) {
  const list = [...deals];
  const far = Number.MAX_SAFE_INTEGER;
  switch (sort) {
    case "discount":
      return list.sort((a, b) => discountPercent(b.price, b.original_price) - discountPercent(a.price, a.original_price));
    case "price-asc":
      return list.sort((a, b) => (a.price ?? far) - (b.price ?? far));
    case "price-desc":
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "ending":
      return list.sort(
        (a, b) =>
          (a.expires_at ? new Date(a.expires_at).getTime() : far) -
          (b.expires_at ? new Date(b.expires_at).getTime() : far)
      );
    default:
      return list.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }
}

export default function DealsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [deals, setDeals] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(params.get("q") || "");
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";

  useEffect(() => {
    listLiveDeals()
      .then(setDeals)
      .catch((e) => setError(e.message));
  }, []);

  function setParam(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  // Keep the search box in the URL without a navigation on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") || "") !== query.trim()) setParam("q", query.trim());
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const counts = useMemo(() => {
    const c = {};
    for (const d of deals || []) c[d.category] = (c[d.category] || 0) + 1;
    return c;
  }, [deals]);

  const visible = useMemo(() => {
    if (!deals) return [];
    const q = query.trim().toLowerCase();
    const filtered = deals.filter((d) => {
      if (category && d.category !== category) return false;
      if (!q) return true;
      return [d.title, d.brand, d.retailer, d.description].some((v) => v && v.toLowerCase().includes(q));
    });
    return sortDeals(filtered, sort);
  }, [deals, query, category, sort]);

  const featured = useMemo(() => (deals || []).filter((d) => d.is_featured).slice(0, 8), [deals]);
  const filtering = Boolean(category || query.trim());

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-stone-600">
        <p className="font-semibold">We couldn&apos;t load deals right now.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      {!filtering && featured.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 pt-8" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="mb-3 text-xl font-bold text-stone-900">
            🔥 Hot deals
          </h2>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {featured.map((d) => (
              <div key={d.id} className="flex w-[78%] shrink-0 snap-start [&>article]:w-full sm:w-[45%] lg:w-[23.5%]">
                <DealCard deal={d} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="deals" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-8" aria-labelledby="all-heading">
        <div id="categories" className="scroll-mt-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search deals</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drivers, balls, brands…"
                className="field pl-10"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <span className="shrink-0">Sort by</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)} className="field sm:w-52">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter by category">
            <Chip active={!category} onClick={() => setParam("category", "")}>
              All {deals ? `(${deals.length})` : ""}
            </Chip>
            {CATEGORIES.filter((c) => counts[c.slug]).map((c) => (
              <Chip key={c.slug} active={category === c.slug} onClick={() => setParam("category", category === c.slug ? "" : c.slug)}>
                {c.label} ({counts[c.slug]})
              </Chip>
            ))}
          </div>
        </div>

        <h2 id="all-heading" className="mb-4 mt-6 text-xl font-bold text-stone-900">
          {filtering ? `${visible.length} matching deal${visible.length === 1 ? "" : "s"}` : "All deals"}
        </h2>

        {deals === null ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-stone-100" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="card px-6 py-14 text-center">
            <p className="text-lg font-semibold text-stone-800">No deals found</p>
            <p className="mt-1 text-stone-500">Try a different search or category. New deals are added every day.</p>
            {filtering && (
              <button
                className="btn btn-ghost mt-4"
                onClick={() => {
                  setQuery("");
                  router.replace(pathname, { scroll: false });
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Chip({ active, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
        active ? "border-turf-700 bg-turf-700 text-white" : "border-stone-300 bg-white text-stone-700 hover:border-turf-600"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
