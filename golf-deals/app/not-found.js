import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-5xl">⛳</p>
        <h1 className="mt-4 text-2xl font-bold">Out of bounds</h1>
        <p className="mt-2 text-stone-600">We couldn&apos;t find that page.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to the deals
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
