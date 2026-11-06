"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DealCard from "@/components/DealCard";
import Toggle from "@/components/admin/Toggle";
import { getDeal, saveDeal, uploadImage } from "@/lib/dealsApi";
import { CATEGORIES } from "@/lib/config";
import { discountPercent, fromLocalInput, toLocalInput } from "@/lib/format";

const EMPTY = {
  title: "",
  description: "",
  brand: "",
  category: "drivers",
  retailer: "",
  deal_url: "",
  image_url: "",
  price: "",
  original_price: "",
  coupon_code: "",
  is_featured: false,
  is_active: true,
  starts_at: "",
  expires_at: "",
};

// Form state keeps dates as datetime-local strings and numbers as strings.
function toForm(deal) {
  const f = { ...EMPTY };
  for (const k of Object.keys(EMPTY)) if (deal[k] !== null && deal[k] !== undefined) f[k] = deal[k];
  f.starts_at = toLocalInput(deal.starts_at);
  f.expires_at = toLocalInput(deal.expires_at);
  f.price = deal.price ?? "";
  f.original_price = deal.original_price ?? "";
  return f;
}

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
}

function validate(f) {
  const errors = {};
  if (!f.title.trim()) errors.title = "Give the deal a title.";
  if (!/^https?:\/\/\S+\.\S+/i.test(f.deal_url.trim())) errors.deal_url = "Enter the full link, starting with https://";
  if (f.price === "" || Number(f.price) < 0) errors.price = "Enter the deal price.";
  if (f.original_price !== "" && Number(f.original_price) < Number(f.price))
    errors.original_price = "The original price should be higher than the deal price.";
  if (f.starts_at && f.expires_at && new Date(f.expires_at) <= new Date(f.starts_at))
    errors.expires_at = "The end time must be after the start time.";
  return errors;
}

export default function DealEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const copyId = params.get("copy");

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(id || copyId));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const sourceId = id || copyId;
    if (!sourceId) return;
    getDeal(sourceId)
      .then((d) => {
        if (!d) {
          setSaveError("That deal couldn't be found.");
          return;
        }
        const f = toForm(d);
        if (copyId) {
          f.title = `${f.title} (copy)`;
          f.is_active = false; // copies start hidden so nothing goes live by accident
          f.starts_at = "";
          f.expires_at = "";
        }
        setForm(f);
      })
      .catch((e) => setSaveError(e.message))
      .finally(() => setLoading(false));
  }, [id, copyId]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function expireIn(hours) {
    set("expires_at", hours ? toLocalInput(hoursFromNow(hours)) : "");
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSaveError("");
    try {
      set("image_url", await uploadImage(file));
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await saveDeal({
        ...form,
        id: id || undefined,
        title: form.title.trim(),
        deal_url: form.deal_url.trim(),
        coupon_code: form.coupon_code.trim().toUpperCase(),
        starts_at: fromLocalInput(form.starts_at),
        expires_at: fromLocalInput(form.expires_at),
      });
      router.push("/admin/?saved=1");
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-turf-700" />
      </div>
    );
  }

  const pct = discountPercent(form.price, form.original_price);
  const preview = {
    ...form,
    id: id || "preview",
    title: form.title || "Your deal title",
    price: form.price === "" ? null : Number(form.price),
    original_price: form.original_price === "" ? null : Number(form.original_price),
    expires_at: fromLocalInput(form.expires_at),
    deal_url: form.deal_url || "#",
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-6xl px-4 pb-32 pt-6">
      <Link href="/admin/" className="text-sm text-stone-500 hover:text-stone-800">
        ← Back to deals
      </Link>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{id ? "Edit deal" : copyId ? "Copy of deal" : "New deal"}</h1>
        {id && (
          <Link href={`/admin/edit/?copy=${encodeURIComponent(id)}`} className="btn btn-ghost">
            Duplicate
          </Link>
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <Section title="Product">
            <Field id="title" label="Deal title" error={errors.title}>
              <input id="f-title" className="field" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Ridgeline X9 Driver – 44% off" maxLength={200} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="brand" label="Brand" hint="Optional">
                <input id="f-brand" className="field" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
              </Field>
              <Field id="category" label="Category">
                <select id="f-category" className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="description" label="Description" hint="Optional: what makes this deal worth it?">
              <textarea id="f-description" rows={4} className="field" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </Section>

          <Section title="Where to buy">
            <Field id="deal_url" label="Deal link" error={errors.deal_url} hint="Your affiliate link or the product page">
              <input id="f-deal_url" type="url" inputMode="url" className="field" value={form.deal_url} onChange={(e) => set("deal_url", e.target.value)} placeholder="https://" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="retailer" label="Retailer" hint="Optional">
                <input id="f-retailer" className="field" value={form.retailer} onChange={(e) => set("retailer", e.target.value)} placeholder="e.g. Fairway Outlet" />
              </Field>
              <Field id="coupon_code" label="Coupon code" hint="Optional">
                <input id="f-coupon_code" className="field font-mono uppercase" value={form.coupon_code} onChange={(e) => set("coupon_code", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Price">
            <div className="grid grid-cols-2 gap-4">
              <Field id="price" label="Deal price ($)" error={errors.price}>
                <input id="f-price" type="number" inputMode="decimal" min="0" step="0.01" className="field" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field id="original_price" label="Original price ($)" error={errors.original_price}>
                <input id="f-original_price" type="number" inputMode="decimal" min="0" step="0.01" className="field" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} />
              </Field>
            </div>
            {pct > 0 && <p className="text-sm font-semibold text-turf-700">Shows as {pct}% OFF</p>}
          </Section>

          <Section title="Image">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                {form.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image_url} alt="" className="h-full w-full object-contain p-2" />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-xs text-stone-400">No image</div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? "Uploading…" : "Upload photo"}
                  </button>
                  {form.image_url && (
                    <button type="button" className="btn btn-danger" onClick={() => set("image_url", "")}>
                      Remove
                    </button>
                  )}
                </div>
                <Field id="image_url" label="…or paste an image link">
                  <input
                    id="f-image_url"
                    type="url"
                    className="field"
                    value={form.image_url.startsWith("data:") ? "" : form.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    placeholder="https://"
                  />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Timing">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="starts_at" label="Starts" hint="Leave empty to start now">
                <input id="f-starts_at" type="datetime-local" className="field" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} />
              </Field>
              <Field id="expires_at" label="Ends" hint="Leave empty for no end date" error={errors.expires_at}>
                <input id="f-expires_at" type="datetime-local" className="field" value={form.expires_at} onChange={(e) => set("expires_at", e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="self-center text-sm text-stone-500">Quick end:</span>
              {[
                ["24 hours", 24],
                ["48 hours", 48],
                ["7 days", 168],
                ["No end", 0],
              ].map(([label, h]) => (
                <button key={label} type="button" onClick={() => expireIn(h)} className="min-h-10 rounded-full bg-stone-100 px-3 text-sm font-medium text-stone-700 hover:bg-stone-200">
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Visibility">
            <div className="flex flex-col gap-1">
              <Toggle checked={form.is_active} onChange={(v) => set("is_active", v)} label="Show on site" />
              <Toggle checked={form.is_featured} onChange={(v) => set("is_featured", v)} label="Feature in “Hot deals”" />
            </div>
          </Section>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-semibold text-stone-600">Preview</p>
          <div className="pointer-events-none mx-auto max-w-xs">
            <DealCard deal={preview} />
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <p className="min-w-0 truncate text-sm text-red-700" role="alert">
            {saveError || (Object.keys(errors).some((k) => errors[k]) ? "Please fix the highlighted fields." : "")}
          </p>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin/" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary min-w-28" disabled={saving || uploading}>
              {saving ? "Saving…" : id ? "Save changes" : "Publish deal"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  const headingId = `s-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <section className="card min-w-0 space-y-4 p-4 sm:p-5" role="group" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-base font-semibold text-stone-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={`f-${id}`} className="label">
        {label} {hint && <span className="font-normal text-stone-400">· {hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
