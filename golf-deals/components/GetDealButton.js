"use client";

import { recordClick } from "@/lib/dealsApi";

// Opens the retailer's page in a new tab and counts the click for the admin.
export default function GetDealButton({ deal, className = "", label = "Get Deal" }) {
  return (
    <a
      href={deal.deal_url}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      onClick={() => recordClick(deal.id)}
      className={`btn btn-deal ${className}`}
    >
      {label}
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M11 3a1 1 0 100 2h2.59l-6.3 6.3a1 1 0 101.42 1.4L15 6.42V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
      </svg>
    </a>
  );
}
