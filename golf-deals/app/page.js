import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DealsBrowser from "@/components/DealsBrowser";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-turf-700 via-turf-800 to-turf-900 text-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-turf-500/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-turf-200">Updated daily</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
              The best golf deals, all in one place.
            </h1>
            <p className="mt-3 max-w-xl text-turf-100 sm:text-lg">
              Clubs, balls, apparel and gear at big discounts. Many deals only last a short time.
            </p>
            <a href="#deals" className="btn btn-deal mt-6 px-6 text-base">
              Shop today&apos;s deals
            </a>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-96 animate-pulse bg-stone-100" />
              ))}
            </div>
          }
        >
          <DealsBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
