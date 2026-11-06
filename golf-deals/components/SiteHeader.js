import Link from "next/link";
import Logo from "./Logo";
import DemoBanner from "./DemoBanner";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      <DemoBanner />
      <div className="bg-turf-800 shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-1 text-sm font-medium text-turf-100">
            <Link href="/#deals" className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-turf-700 hover:text-white">
              Deals
            </Link>
            <Link href="/#categories" className="hidden whitespace-nowrap rounded-lg px-3 py-2 hover:bg-turf-700 hover:text-white sm:block">
              Categories
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
