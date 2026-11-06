export function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function discountPercent(price, originalPrice) {
  const p = Number(price);
  const o = Number(originalPrice);
  if (!p || !o || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
}

export function savings(price, originalPrice) {
  const p = Number(price);
  const o = Number(originalPrice);
  if (!p || !o || o <= p) return 0;
  return o - p;
}

// Status of a deal from the admin's point of view.
export function dealStatus(deal, now = Date.now()) {
  if (!deal.is_active) return "hidden";
  if (deal.starts_at && new Date(deal.starts_at).getTime() > now) return "scheduled";
  if (deal.expires_at && new Date(deal.expires_at).getTime() <= now) return "expired";
  return "live";
}

export function isLive(deal, now = Date.now()) {
  return dealStatus(deal, now) === "live";
}

export function timeLeftParts(expiresAt, now = Date.now()) {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    ms,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// <input type="datetime-local"> works in local time without a timezone.
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInput(value) {
  return value ? new Date(value).toISOString() : null;
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
