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
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <FilterSidebar filters={filters} setFilters={setFilters} onApply={applyFilters} onReset={resetFilters} />
      <section>
        {/* Hero */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="m-0 text-xl font-semibold text-slate-900">Car Wash Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and manage all your appointments in a clean, simple interface.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm print:hidden">
          <SearchBar
            value={q}
            onChange={(val) => {
              setQ(val)
              setPage(1)
            }}
          />
          <SortBar sortBy={sort.sortBy} order={sort.order} onChange={(val) => setSort(val)} />
          <Link
            className="inline-flex items-center rounded-md bg-sky-500 text-white px-3 py-2 text-sm hover:bg-sky-600"
            to="/booking/new"
          >
            + New Booking
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && items.length === 0 && <p>No bookings found.</p>}

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  )
}
