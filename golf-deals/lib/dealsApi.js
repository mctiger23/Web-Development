// Single place where the app reads and writes deals.
// Uses Supabase when configured, otherwise a localStorage-backed demo store.
import { IS_DEMO } from "./config";
import { supabase } from "./supabase";
import { buildSampleDeals } from "./sampleDeals";
import { isLive } from "./format";

export const DEAL_FIELDS = [
  "title",
  "description",
  "brand",
  "category",
  "retailer",
  "deal_url",
  "image_url",
  "price",
  "original_price",
  "coupon_code",
  "is_featured",
  "is_active",
  "starts_at",
  "expires_at",
];

const IMAGE_BUCKET = "deal-images";

/* ---------------- demo store ---------------- */

const DEMO_KEY = "golfdeals_demo_deals_v1";
const DEMO_AUTH_KEY = "golfdeals_demo_session_v1";
const authListeners = new Set();

function demoRead() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded = buildSampleDeals();
  demoWrite(seeded);
  return seeded;
}

function demoWrite(deals) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(deals));
  } catch (e) {
    throw new Error("Couldn't save demo data. Your browser storage may be full (large images use a lot of space).");
  }
}

export function resetDemoData() {
  demoWrite(buildSampleDeals());
}

function pick(deal) {
  const out = {};
  for (const f of DEAL_FIELDS) if (f in deal) out[f] = deal[f];
  for (const f of ["price", "original_price"]) {
    if (f in out) out[f] = out[f] === "" || out[f] === null ? null : Number(out[f]);
  }
  for (const f of ["starts_at", "expires_at", "image_url", "coupon_code", "description", "brand", "retailer"]) {
    if (f in out && out[f] === "") out[f] = null;
  }
  return out;
}

function check(error) {
  if (error) throw new Error(error.message || "Something went wrong");
}

/* ---------------- public ---------------- */

export async function listLiveDeals() {
  if (IS_DEMO) {
    return demoRead().filter((d) => isLive(d));
  }
  // Row level security only returns live deals to visitors; filter again
  // here so a logged-in admin browsing the site sees the same thing.
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  check(error);
  return data.filter((d) => isLive(d));
}

export async function getDeal(id) {
  if (IS_DEMO) return demoRead().find((d) => d.id === id) || null;
  const { data, error } = await supabase.from("deals").select("*").eq("id", id).maybeSingle();
  check(error);
  return data;
}

export async function recordClick(id) {
  try {
    if (IS_DEMO) {
      const deals = demoRead();
      const d = deals.find((x) => x.id === id);
      if (d) {
        d.clicks = (d.clicks || 0) + 1;
        demoWrite(deals);
      }
      return;
    }
    await supabase.rpc("increment_deal_clicks", { deal_id: id });
  } catch {
    // Click tracking should never block the visitor.
  }
}

/* ---------------- admin ---------------- */

export async function listAllDeals() {
  if (IS_DEMO) {
    return [...demoRead()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const { data, error } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
  check(error);
  return data;
}

export async function saveDeal(deal) {
  const fields = pick(deal);
  const now = new Date().toISOString();
  if (IS_DEMO) {
    const deals = demoRead();
    if (deal.id) {
      const i = deals.findIndex((d) => d.id === deal.id);
      if (i === -1) throw new Error("Deal not found");
      deals[i] = { ...deals[i], ...fields, updated_at: now };
      demoWrite(deals);
      return deals[i];
    }
    const created = { id: `demo-${Date.now()}`, clicks: 0, created_at: now, updated_at: now, ...fields };
    deals.unshift(created);
    demoWrite(deals);
    return created;
  }
  if (deal.id) {
    const { data, error } = await supabase.from("deals").update(fields).eq("id", deal.id).select().single();
    check(error);
    return data;
  }
  const { data, error } = await supabase.from("deals").insert(fields).select().single();
  check(error);
  return data;
}

export async function updateDealFields(id, fields) {
  return saveDeal({ id, ...fields });
}

export async function deleteDeal(id) {
  if (IS_DEMO) {
    demoWrite(demoRead().filter((d) => d.id !== id));
    return;
  }
  const { error } = await supabase.from("deals").delete().eq("id", id);
  check(error);
}

export async function uploadImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB.");
  if (IS_DEMO) {
    return resizeToDataUrl(file, 800);
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  check(error);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Demo mode keeps images in localStorage, so shrink them first.
function resizeToDataUrl(file, maxSize) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("Couldn't read that image."));
    img.src = url;
  });
}

/* ---------------- auth ---------------- */

export async function getSession() {
  if (IS_DEMO) {
    try {
      const raw = sessionStorage.getItem(DEMO_AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signIn(email, password) {
  if (IS_DEMO) {
    const session = { user: { email: email || "demo@example.com" } };
    sessionStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(session));
    authListeners.forEach((fn) => fn(session));
    return session;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  check(error);
  return data.session;
}

export async function signOut() {
  if (IS_DEMO) {
    sessionStorage.removeItem(DEMO_AUTH_KEY);
    authListeners.forEach((fn) => fn(null));
    return;
  }
  await supabase.auth.signOut();
}

export function onAuthChange(callback) {
  if (IS_DEMO) {
    authListeners.add(callback);
    return () => authListeners.delete(callback);
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

// Confirms the signed-in user is listed in the `admins` table.
export async function isAdmin(session) {
  if (!session) return false;
  if (IS_DEMO) return true;
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
