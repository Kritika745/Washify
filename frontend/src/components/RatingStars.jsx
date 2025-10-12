"use client"

export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  return (
    <div className="flex items-center gap-2" aria-label="rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`mr-1 bg-transparent p-0 text-xl leading-none ${
            n <= value ? "text-amber-500" : "text-slate-300"
          } ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-105 transition-transform"}`}
          onClick={() => !readOnly && onChange?.(n)}
          disabled={readOnly}
          aria-pressed={n <= value}
          aria-label={`Rate ${n}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
