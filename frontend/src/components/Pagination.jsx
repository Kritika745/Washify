"use client"

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const prev = () => onChange?.(Math.max(1, page - 1))
  const next = () => onChange?.(Math.min(totalPages, page + 1))

  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 disabled:opacity-60"
        onClick={prev}
        disabled={page <= 1}
      >
        Prev
      </button>
      <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
        Page {page} / {totalPages}
      </span>
      <button
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 disabled:opacity-60"
        onClick={next}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  )
}
