"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../api/axios.js"
import BookingCard from "../components/BookingCard.jsx"
import SearchBar from "../components/SearchBar.jsx"
import FilterSidebar from "../components/FilterSidebar.jsx"
import Pagination from "../components/Pagination.jsx"
import SortBar from "../components/SortBar.jsx"

export default function Home() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(Number(params.get("page") || 1))
  const [totalPages, setTotalPages] = useState(1)
  const [q, setQ] = useState(params.get("q") || "")
  const [filters, setFilters] = useState({
    serviceType: params.get("serviceType") || undefined,
    status: params.get("status") || undefined,
    carType: params.get("carType") || undefined,
    startDate: params.get("startDate") || undefined,
    endDate: params.get("endDate") || undefined,
    addOn: params.get("addOn") || undefined,
    minRating: params.get("minRating") ? Number(params.get("minRating")) : undefined,
  })
  const [sort, setSort] = useState({
    sortBy: params.get("sortBy") || "createdAt",
    order: params.get("order") || "desc",
  })
  const limit = 9

  const queryObj = useMemo(() => {
    const o = { page, limit, q, ...filters, ...sort }
    Object.keys(o).forEach((k) => (o[k] === undefined || o[k] === "" ? delete o[k] : null))
    return o
  }, [page, q, filters, sort])

  useEffect(() => {
    const pairs = []
    Object.entries(queryObj).forEach(([k, v]) => pairs.push([k, String(v)]))
    setParams(pairs)
  }, [queryObj])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get("/api/bookings", { params: queryObj })
      .then((res) => {
        if (cancelled) return
        setItems(res.data.data)
        setTotalPages(res.data.totalPages)
      })
      .catch((e) => !cancelled && setError(e?.response?.data?.message || e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => (cancelled = true)
  }, [queryObj])

  const applyFilters = () => setPage(1)
  const resetFilters = () =>
    setFilters({
      serviceType: undefined,
      status: undefined,
      carType: undefined,
      startDate: undefined,
      endDate: undefined,
      addOn: undefined,
      minRating: undefined,
    })

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] bg-gradient-to-br from-slate-50 via-sky-50/40 to-white p-6 rounded-2xl min-h-screen">
      {/* Sidebar */}
      <FilterSidebar filters={filters} setFilters={setFilters} onApply={applyFilters} onReset={resetFilters} />

      {/* Main Section */}
      <section className="flex flex-col">
        {/* Hero */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-md flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Car Wash Dashboard</h1>
          <p className="text-slate-600 text-sm">
            Manage, track, and explore your car wash bookings with style.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar
              value={q}
              onChange={(val) => {
                setQ(val)
                setPage(1)
              }}
              placeholder="🔍 Search customer, car or service..."
            />
            <SortBar sortBy={sort.sortBy} order={sort.order} onChange={(val) => setSort(val)} />
          </div>
          <Link
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-lg transition-all duration-200"
            to="/booking/new"
          >
            + New Booking
          </Link>
        </div>

        {/* Status */}
        {loading && (
          <p className="text-center text-slate-500 mt-6 animate-pulse">Loading bookings...</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-center text-slate-500 mt-6">No bookings found 🧼</p>
        )}

        {/* Cards grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>
    </div>
  )
}
