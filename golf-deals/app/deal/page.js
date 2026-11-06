import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DealDetail from "./DealDetail";

export const metadata = { title: "Deal" };

// Uses /deal/?id=... so new deals work without rebuilding the static site.
export default function DealPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto my-8 h-[28rem] w-full max-w-5xl animate-pulse rounded-2xl bg-stone-100" />}>
          <DealDetail />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
