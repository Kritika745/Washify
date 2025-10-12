import { Link } from "react-router-dom"
import RatingStars from "./RatingStars.jsx"

function statusClass(status) {
  const s = status?.toLowerCase()
  const base = "px-2 py-0.5 rounded-full text-xs border border-slate-200"
  if (s === "pending") return `${base} bg-orange-50`
  if (s === "confirmed") return `${base} bg-sky-50`
  if (s === "completed") return `${base} bg-emerald-50`
  if (s === "cancelled") return `${base} bg-rose-50`
  return base
}

export default function BookingCard({ booking }) {
  const d = booking
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-semibold text-slate-900">{d.customerName}</h3>
        <span className={statusClass(d.status)}>{d.status}</span>
      </div>

      <div className="mt-2 space-y-1 text-sm text-slate-700">
        <div>
          <strong className="font-medium text-slate-900">Car:</strong> {d.carDetails?.make} {d.carDetails?.model} (
          {d.carDetails?.type || "n/a"})
        </div>
        <div>
          <strong className="font-medium text-slate-900">Service:</strong> {d.serviceType}
        </div>
        <div>
          <strong className="font-medium text-slate-900">Time:</strong>{" "}
          {d.date ? new Date(d.date).toLocaleDateString() : "n/a"} {d.timeSlot || ""}
        </div>
        <div>
          <strong className="font-medium text-slate-900">Price:</strong> ${d.price ?? 0}{" "}
          <span className="mx-1 text-slate-400">•</span>
          <strong className="font-medium text-slate-900">Duration:</strong> {d.duration ?? 0} min
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <strong className="font-medium text-slate-900">Rating:</strong> <RatingStars value={d.rating || 0} readOnly />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          className="inline-flex items-center rounded-md bg-sky-500 px-3 py-2 text-sm text-white hover:bg-sky-600"
          to={`/booking/${d._id}`}
        >
          View
        </Link>
        <Link
          className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50"
          to={`/booking/${d._id}/edit`}
        >
          Edit
        </Link>
      </div>
    </div>
  )
}
