export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Fairway Steals";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// With no Supabase keys the site runs in demo mode: sample deals are kept in
// the browser's localStorage and any login works for the admin.
export const IS_DEMO = !SUPABASE_URL || !SUPABASE_ANON_KEY;

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const CATEGORIES = [
  { slug: "drivers", label: "Drivers & Woods", color: "#166534" },
  { slug: "irons", label: "Irons", color: "#1e3a8a" },
  { slug: "wedges", label: "Wedges", color: "#7c2d12" },
  { slug: "putters", label: "Putters", color: "#581c87" },
  { slug: "balls", label: "Golf Balls", color: "#0f766e" },
  { slug: "bags", label: "Bags & Carts", color: "#854d0e" },
  { slug: "apparel", label: "Apparel", color: "#9d174d" },
  { slug: "shoes", label: "Shoes", color: "#334155" },
  { slug: "tech", label: "GPS & Tech", color: "#0e7490" },
  { slug: "training", label: "Training Aids", color: "#4d7c0f" },
  { slug: "accessories", label: "Accessories", color: "#57534e" },
];

export function categoryFor(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || { slug, label: slug || "Other", color: "#14532d" };
}

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Biggest discount" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "ending", label: "Ending soon" },
];
