"use client"

import RatingStars from "./RatingStars.jsx"
import { Star, SlidersHorizontal, ChevronDown, RotateCw, Check } from "lucide-react";


/**
 * A reusable form field wrapper for the sidebar for consistent styling.
 */
const FilterField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
    {children}
  </div>
);

export default function FilterSidebar({ filters, setFilters, onApply, onReset }) {
  const commonInputClass = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none transition-colors";

  return (
    <aside className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-fit lg:sticky lg:top-6 print:hidden">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-slate-500" />
          <h3 className="m-0 font-semibold text-slate-800">Filters</h3>
        </div>
        <button onClick={onReset} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors">
          Reset All
        </button>
      </div>

      {/* Filter Fields */}
      <div className="space-y-5">
        <FilterField label="Service Type">
          <select className={commonInputClass} value={filters.serviceType || ""} onChange={(e) => setFilters({ ...filters, serviceType: e.target.value || undefined })}>
            <option value="">Any</option>
            <option>Basic Wash</option>
            <option>Deluxe Wash</option>
            <option>Full Detailing</option>
          </select>
        </FilterField>

        <FilterField label="Status">
          <select className={commonInputClass} value={filters.status || ""} onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}>
            <option value="">Any</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </FilterField>

        <FilterField label="Car Type">
          <select className={commonInputClass} value={filters.carType || ""} onChange={(e) => setFilters({ ...filters, carType: e.target.value || undefined })}>
            <option value="">Any</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="luxury">Luxury</option>
          </select>
        </FilterField>

        <FilterField label="Date Range">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" placeholder="Start" className={commonInputClass} value={filters.startDate || ""} onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })} />
            <input type="date" placeholder="End" className={commonInputClass} value={filters.endDate || ""} onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })} />
          </div>
        </FilterField>
        
        <FilterField label="Minimum Rating">
          <RatingStars value={filters.minRating || 0} onChange={(v) => setFilters({ ...filters, minRating: v })} />
        </FilterField>

        {/* Action Button */}
        <div className="pt-2">
             <button 
                onClick={onApply} 
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
             >
                <Check size={16} />
                Apply Filters
             </button>
        </div>
      </div>
    </aside>
  )
}