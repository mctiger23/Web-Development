export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-stone-700">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-6 w-11 rounded-full bg-stone-300 transition peer-checked:bg-turf-600 peer-focus-visible:ring-2 peer-focus-visible:ring-turf-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      {label}
    </label>
  );
}
