import { IS_DEMO } from "@/lib/config";

export default function DemoBanner() {
  if (!IS_DEMO) return null;
  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900 sm:text-sm">
      <strong>Demo mode:</strong> sample deals are saved in this browser only. Add your Supabase keys to go live.
    </div>
  );
}
