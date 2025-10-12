"use client"

export default function SortBar({ sortBy, order, onChange }) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <select
        className="border border-slate-200 px-2 py-2"
        value={sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value, order })}
      >
        <option value="createdAt">Newest</option>
        <option value="date">Date</option>
        <option value="price">Price</option>
        <option value="duration">Duration</option>
        <option value="status">Status</option>
      </select>
      <select
        className="border border-slate-200 px-2 py-2"
        value={order}
        onChange={(e) => onChange({ sortBy, order: e.target.value })}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  )
}
