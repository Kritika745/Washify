import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";

// A more subtle statusClass function
function statusClass(status) {
  const s = status?.toLowerCase();
  const base = "px-2 py-0.5 rounded-full text-xs font-medium border";
  if (s === "pending") return `${base} bg-sky-50 text-sky-700 border-sky-200`;
  if (s === "confirmed") return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  if (s === "completed") return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
  if (s === "cancelled") return `${base} bg-rose-50 text-rose-700 border-rose-200`;
  return `${base} bg-slate-50 text-slate-600 border-slate-200`;
}

// Function to get a top border color based on status for accent
function statusBorderClass(status) {
  const s = status?.toLowerCase();
  if (s === "pending") return "border-t-sky-400";
  if (s === "confirmed") return "border-t-blue-500";
  if (s === "completed") return "border-t-emerald-500";
  if (s === "cancelled") return "border-t-rose-500";
  return "border-t-slate-300";
}


export default function BookingCard({ booking }) {
  const d = booking;
  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md border-t-4 ${statusBorderClass(d.status)}`}>
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="m-0 text-base font-bold text-slate-800">{d.customerName}</h3>
        <span className={statusClass(d.status)}>{d.status}</span>
      </div>

      {/* --- Details --- */}
      <div className="px-4 pb-2 text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="font-normal text-slate-500">Car</dt>
            <dd className="font-medium text-slate-800 text-right">{d.carDetails?.make} {d.carDetails?.model}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-normal text-slate-500">Service</dt>
            <dd className="font-medium text-slate-800 text-right">{d.serviceType}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-normal text-slate-500">Appointment</dt>
            <dd className="font-medium text-slate-800 text-right">
              {d.date ? new Date(d.date).toLocaleDateString() : "n/a"} {d.timeSlot || ""}
            </dd>
          </div>
          <div className="flex justify-between items-center">
             <dt className="font-normal text-slate-500">Rating</dt>
             <dd><RatingStars value={d.rating || 0} readOnly /></dd>
          </div>
        </dl>
      </div>
      
      {/* --- Footer & Actions --- */}
      <div className="flex items-center justify-between rounded-b-md bg-slate-50/75 p-3">
         <div className="text-sm">
           <span className="font-medium text-slate-800">${d.price ?? 0}</span>
           <span className="mx-1.5 text-slate-300">|</span>
           <span className="text-slate-500">{d.duration ?? 0} min</span>
         </div>
         <div className="flex items-center gap-2">
            <Link
              className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-600"
              to={`/booking/${d._id}`}
            >
              View
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              to={`/booking/${d._id}/edit`}
            >
              Edit
            </Link>
          </div>
      </div>
    </div>
  );
}