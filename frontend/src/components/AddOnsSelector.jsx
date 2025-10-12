"use client"

const OPTIONS = ["Interior Cleaning", "Polishing", "Wax", "Engine Bay Clean"]

export default function AddOnsSelector({ value = [], onChange }) {
  const toggle = (opt) => {
    const set = new Set(value)
    if (set.has(opt)) set.delete(opt)
    else set.add(opt)
    onChange?.(Array.from(set))
  }

  return (
    <div>
      <div className="flex items-center flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5">
            <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}
