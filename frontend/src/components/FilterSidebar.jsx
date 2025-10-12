"use client"

import RatingStars from "./RatingStars.jsx"

export default function FilterSidebar({ filters, setFilters, onApply, onReset }) {
  const f = filters
  return (
    <aside className="border border-slate-200 rounded-lg p-3 bg-slate-50 print:hidden">
      <h3 className="mt-0 font-semibold">Filters</h3>

      <label className="block text-sm font-medium">Service Type</label>
      <select
        className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
        value={f.serviceType || ""}
        onChange={(e) => setFilters({ ...f, serviceType: e.target.value || undefined })}
      >
        <option value="">Any</option>
        <option>Basic Wash</option>
        <option>Deluxe Wash</option>
        <option>Full Detailing</option>
      </select>

      <div className="h-2" />

      <label className="block text-sm font-medium">Status</label>
      <select
        className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
        value={f.status || ""}
        onChange={(e) => setFilters({ ...f, status: e.target.value || undefined })}
      >
        <option value="">Any</option>
        <option>Pending</option>
        <option>Confirmed</option>
        <option>Completed</option>
        <option>Cancelled</option>
      </select>

      <div className="h-2" />

      <label className="block text-sm font-medium">Car Type</label>
      <select
        className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
        value={f.carType || ""}
        onChange={(e) => setFilters({ ...f, carType: e.target.value || undefined })}
      >
        <option value="">Any</option>
        <option value="sedan">sedan</option>
        <option value="suv">suv</option>
        <option value="hatchback">hatchback</option>
        <option value="luxury">luxury</option>
      </select>

      <div className="h-2" />

      <label className="block text-sm font-medium">Date Range</label>
      <div className="flex gap-2 items-center flex-wrap">
        <input
          className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
          type="date"
          value={f.startDate || ""}
          onChange={(e) => setFilters({ ...f, startDate: e.target.value || undefined })}
        />
        <input
          className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
          type="date"
          value={f.endDate || ""}
          onChange={(e) => setFilters({ ...f, endDate: e.target.value || undefined })}
        />
      </div>

      <div className="h-2" />

      <label className="block text-sm font-medium">Add-on</label>
      <select
        className="border border-slate-200 rounded-md px-3 py-2 w-full sm:w-auto"
        value={f.addOn || ""}
        onChange={(e) => setFilters({ ...f, addOn: e.target.value || undefined })}
      >
        <option value="">Any</option>
        <option>Interior Cleaning</option>
        <option>Polishing</option>
        <option>Wax</option>
        <option>Engine Bay Clean</option>
      </select>

      <div className="h-2" />

      <label className="block text-sm font-medium">Min Rating</label>
      <RatingStars value={f.minRating || 0} onChange={(v) => setFilters({ ...f, minRating: v })} />

      <div className="h-2" />

      <div className="flex gap-2 items-center flex-wrap">
        <button
          className="inline-flex items-center rounded-md bg-sky-500 text-white px-3 py-2 text-sm hover:bg-sky-600"
          onClick={onApply}
        >
          Apply
        </button>
        <button
          className="inline-flex items-center rounded-md border border-slate-200 text-slate-900 bg-transparent px-3 py-2 text-sm hover:bg-slate-50"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </aside>
  )
}
