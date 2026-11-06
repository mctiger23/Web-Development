import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}. Prices and availability can change at any time. Check the
          retailer&apos;s site before buying.
        </p>
        <p className="text-xs">
          We may earn a commission from qualifying purchases.{" "}
          <Link href="/admin/" className="underline hover:text-stone-700">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
