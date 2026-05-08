type Status = "DRAFT" | "ISSUED" | "PAID" | "VOID";

const styles: Record<Status, string> = {
  DRAFT:  "bg-slate-100 text-slate-600 ring-slate-200",
  ISSUED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  PAID:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  VOID:   "bg-red-50 text-red-600 ring-red-200",
};

const dots: Record<Status, string> = {
  DRAFT:  "bg-slate-400",
  ISSUED: "bg-indigo-500",
  PAID:   "bg-emerald-500",
  VOID:   "bg-red-500",
};

const labels: Record<Status, string> = {
  DRAFT:  "Borrador",
  ISSUED: "Emitida",
  PAID:   "Pagada",
  VOID:   "Anulada",
};

export function Badge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[status]}`} />
      {labels[status]}
    </span>
  );
}
