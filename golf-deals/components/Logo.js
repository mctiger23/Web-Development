import Link from "next/link";
import { SITE_NAME } from "@/lib/config";

export default function Logo({ href = "/", compact = false }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold tracking-tight text-white">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#ffffff" />
        <path d="M14 7v16" stroke="#17633a" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 7.5l8 3.5-8 3.5z" fill="#e0422f" />
        <ellipse cx="14" cy="24" rx="6" ry="1.6" fill="#b9dfc2" />
      </svg>
      <span className={`whitespace-nowrap text-lg ${compact ? "hidden sm:inline" : ""}`}>{SITE_NAME}</span>
    </Link>
  );
}
