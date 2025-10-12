"use client"

import { useEffect, useState } from "react"

export default function SearchBar({ value, onChange, placeholder = "Search by name or car..." }) {
  const [local, setLocal] = useState(value || "")
  useEffect(() => setLocal(value || ""), [value])

  useEffect(() => {
    const id = setTimeout(() => onChange?.(local), 400)
    return () => clearTimeout(id)
  }, [local])

  return (
    <input
      className="border border-slate-200 rounded-full px-3 py-2 w-64 sm:w-72"
      placeholder={placeholder}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      aria-label="search"
    />
  )
}
