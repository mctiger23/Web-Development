"use client";

import { useSyncExternalStore } from "react";
import { timeLeftParts } from "@/lib/format";

// One shared 1-second clock for every countdown on the page.
const listeners = new Set();
let timer = null;
let now = Date.now();

function subscribe(callback) {
  listeners.add(callback);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((fn) => fn());
    }, 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getNow = () => now;
const getServerNow = () => null; // render nothing in the static HTML, then fill in

// "Ends in 2d 4h" or, inside 24 hours, a live "Ends in 03:12:44".
export default function Countdown({ expiresAt, className = "" }) {
  const current = useSyncExternalStore(subscribe, getNow, getServerNow);

  if (!expiresAt || current === null) return null;
  const t = timeLeftParts(expiresAt, current);
  if (!t) return <span className={`text-stone-500 ${className}`}>Deal ended</span>;

  const pad = (n) => String(n).padStart(2, "0");
  const urgent = t.days === 0;
  const text = urgent ? `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}` : `${t.days}d ${t.hours}h`;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium tabular-nums ${urgent ? "text-flag" : "text-stone-600"} ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-12.5a.75.75 0 00-1.5 0V10c0 .2.08.39.22.53l2.5 2.5a.75.75 0 101.06-1.06l-2.28-2.28V5.5z"
          clipRule="evenodd"
        />
      </svg>
      Ends in {text}
    </span>
  );
}
