"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DealImage from "@/components/DealImage";
import StatusBadge from "@/components/admin/StatusBadge";
import Toggle from "@/components/admin/Toggle";
import { deleteDeal, listAllDeals, resetDemoData, updateDealFields } from "@/lib/dealsApi";
import { IS_DEMO, categoryFor } from "@/lib/config";
import { dealStatus, discountPercent, formatDateTime, formatPrice } from "@/lib/format";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "hidden", label: "Hidden" },
];

export default function Dashboard() {
  const params = useSearchParams();
  const [deals, setDeals] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(params.get("saved") ? "Deal saved." : "");

  async function load() {
    try {
      setDeals(await listAllDeals());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    listAllDeals()
      .then(setDeals)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const withStatus = useMemo(() => (deals || []).map((d) => ({ ...d, status: dealStatus(d) })), [deals]);

  const counts = useMemo(() => {
    const c = { all: withStatus.length, live: 0, scheduled: 0, expired: 0, hidden: 0 };
    for (const d of withStatus) c[d.status]++;
    return c;
  }, [withStatus]);

  const totalClicks = withStatus.reduce((sum, d) => sum + (d.clicks || 0), 0);

  const visible = withStatus.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false;
    const q = query.trim().toLowerCase();
    return !q || [d.title, d.brand, d.retailer].some((v) => v && v.toLowerCase().includes(q));
  });

  async function patch(deal, fields, message) {
    // Update the screen straight away, then save.
    setDeals((list) => list.map((d) => (d.id === deal.id ? { ...d, ...fields } : d)));
    try {
      await updateDealFields(deal.id, fields);
      setNotice(message);
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  async function remove(deal) {
    if (!window.confirm(`Delete "${deal.title}"? This can't be undone.`)) return;
    try {
      await deleteDeal(deal.id);
      setDeals((list) => list.filter((d) => d.id !== deal.id));
      setNotice("Deal deleted.");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pb-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Link href="/admin/edit/" className="btn btn-primary hidden sm:inline-flex">
          + New deal
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Live now" value={counts.live} tone="text-turf-700" />
        <Stat label="Scheduled" value={counts.scheduled} tone="text-sky-700" />
        <Stat label="Expired" value={counts.expired} tone="text-stone-500" />
        <Stat label="Total clicks" value={totalClicks} tone="text-flag" />
      </div>

      {notice && (
        <div role="status" className="mt-4 rounded-xl bg-turf-100 px-4 py-3 text-sm font-medium text-turf-800">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-semibold" aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, brand or retailer"
          className="field sm:max-w-xs"
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium ${
                filter === f.value ? "bg-stone-900 text-white" : "bg-white text-stone-700 ring-1 ring-stone-300"
              }`}
            >
              {f.label} ({counts[f.value]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {deals === null && !error
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-28 animate-pulse" />)
          : visible.map((d) => <DealRow key={d.id} deal={d} onPatch={patch} onDelete={remove} />)}
        {deals !== null && visible.length === 0 && (
          <div className="card px-6 py-12 text-center text-stone-500">
            {deals.length === 0 ? (
              <>
                <p className="font-semibold text-stone-800">No deals yet</p>
                <Link href="/admin/edit/" className="btn btn-primary mt-4">
                  Add your first deal
                </Link>
              </>
            ) : (
              "No deals match this filter."
            )}
          </div>
        )}
      </div>

      {IS_DEMO && (
        <div className="mt-8 text-center">
          <button
            className="text-sm text-stone-500 underline hover:text-stone-800"
            onClick={() => {
              if (window.confirm("Reset all demo deals back to the sample data?")) {
                resetDemoData();
                load();
                setNotice("Demo data reset.");
              }
            }}
          >
            Reset demo data
          </button>
        </div>
      )}

      {/* Thumb-friendly add button on phones */}
      <Link
        href="/admin/edit/"
        className="btn btn-primary fixed bottom-5 right-5 z-20 h-14 rounded-full px-6 text-base shadow-xl sm:hidden"
      >
        + New deal
      </Link>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="card px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function DealRow({ deal, onPatch, onDelete }) {
  const pct = discountPercent(deal.price, deal.original_price);
  const editHref = `/admin/edit/?id=${encodeURIComponent(deal.id)}`;

  return (
    <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4">
      <Link href={editHref} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
          <DealImage deal={deal} className="[&_svg]:h-8 [&_svg]:w-8 [&_span]:hidden" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={deal.status} />
            {deal.is_featured && <span className="text-xs font-semibold text-amber-600">★ Featured</span>}
            <span className="text-xs text-stone-400">{categoryFor(deal.category).label}</span>
          </div>
          <p className="mt-1 truncate font-semibold text-stone-900">{deal.title}</p>
          <p className="text-sm text-stone-600">
            <span className="font-semibold">{formatPrice(deal.price)}</span>
            {pct > 0 && <span className="text-stone-400"> · {pct}% off</span>}
            {deal.retailer && <span className="text-stone-400"> · {deal.retailer}</span>}
          </p>
          <p className="text-xs text-stone-500">
            {deal.status === "scheduled" ? `Starts ${formatDateTime(deal.starts_at)}` : `Ends ${formatDateTime(deal.expires_at)}`}
            {" · "}
            {deal.clicks || 0} clicks
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2 border-t border-stone-100 pt-3 sm:border-0 sm:pt-0">
        <Toggle
          checked={deal.is_active}
          label="Visible"
          onChange={(v) => onPatch(deal, { is_active: v }, v ? "Deal is visible." : "Deal hidden from the site.")}
        />
        <button
          onClick={() => onPatch(deal, { is_featured: !deal.is_featured }, deal.is_featured ? "Removed from Hot deals." : "Added to Hot deals.")}
          className={`btn px-3 ${deal.is_featured ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "btn-ghost"}`}
          aria-pressed={deal.is_featured}
          title="Show in Hot deals"
        >
          ★<span className="sr-only">Featured</span>
        </button>
        <Link href={editHref} className="btn btn-ghost px-3">
          Edit
        </Link>
        <Link
          href={`/admin/edit/?copy=${encodeURIComponent(deal.id)}`}
          className="btn btn-ghost hidden px-3 sm:inline-flex"
          title="Duplicate this deal"
        >
          Copy
        </Link>
        <button onClick={() => onDelete(deal)} className="btn btn-danger ml-auto px-3 sm:ml-0" aria-label={`Delete ${deal.title}`} title="Delete">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.44c-.8.08-1.58.17-2.37.29a.75.75 0 10.23 1.48l.15-.02.84 10.96A2.75 2.75 0 007.6 19.5h4.8a2.75 2.75 0 002.74-2.6l.84-10.96.15.02a.75.75 0 00.23-1.48A41 41 0 0014 4.19v-.44A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.67.03 2.5.08v-.33c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.33C8.33 4.03 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
