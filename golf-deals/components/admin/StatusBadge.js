const STYLES = {
  live: "bg-turf-100 text-turf-800",
  scheduled: "bg-sky-100 text-sky-800",
  expired: "bg-stone-200 text-stone-600",
  hidden: "bg-amber-100 text-amber-900",
};
const LABELS = { live: "Live", scheduled: "Scheduled", expired: "Expired", hidden: "Hidden" };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
