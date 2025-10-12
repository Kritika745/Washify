"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios.js"
import AddOnsSelector from "../components/AddOnsSelector.jsx"
import RatingStars from "../components/RatingStars.jsx"

const initial = {
  customerName: "",
  carDetails: { make: "", model: "", year: "", type: "" },
  serviceType: "Basic Wash",
  date: "",
  timeSlot: "",
  duration: 60,
  price: 20,
  status: "Pending",
  rating: 0,
  addOns: [],
}

export default function BookingForm({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (mode === "edit" && id) {
      let cancel = false
      api
        .get(`/api/bookings/${id}`)
        .then((res) => {
          if (cancel) return
          const d = res.data.data
          setData({
            ...d,
            date: d.date ? new Date(d.date).toISOString().slice(0, 10) : "",
          })
        })
        .catch((e) => setError(e?.response?.data?.message || e.message))
      return () => (cancel = true)
    }
  }, [mode, id])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...data,
        duration: Number(data.duration) || 0,
        price: Number(data.price) || 0,
        carDetails: {
          ...data.carDetails,
          year: data.carDetails.year ? Number(data.carDetails.year) : undefined,
        },
        date: data.date ? new Date(data.date).toISOString() : undefined,
      }
      if (mode === "edit") {
        await api.put(`/api/bookings/${id}`, payload)
        navigate(`/booking/${id}`)
      } else {
        const res = await api.post("/api/bookings", payload)
        navigate(`/booking/${res.data.data._id}`)
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
      <h2 className="mt-0 font-semibold">{mode === "edit" ? "Edit Booking" : "Add Booking"}</h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-2">
        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Customer Name*</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            required
            value={data.customerName}
            onChange={(e) => setData({ ...data, customerName: e.target.value })}
          />
        </div>

        <h3 className="font-semibold pt-2">Car Details</h3>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Make</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            value={data.carDetails.make}
            onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, make: e.target.value } })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Model</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            value={data.carDetails.model}
            onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, model: e.target.value } })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Year</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            type="number"
            value={data.carDetails.year}
            onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, year: e.target.value } })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Type</label>
          <select
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            value={data.carDetails.type}
            onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, type: e.target.value } })}
          >
            <option value="">Select</option>
            <option value="sedan">sedan</option>
            <option value="suv">suv</option>
            <option value="hatchback">hatchback</option>
            <option value="luxury">luxury</option>
          </select>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Service Type</label>
          <select
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            value={data.serviceType}
            onChange={(e) => setData({ ...data, serviceType: e.target.value })}
          >
            <option>Basic Wash</option>
            <option>Deluxe Wash</option>
            <option>Full Detailing</option>
          </select>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Date</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Time Slot</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            placeholder="e.g. 10:00 - 11:00"
            value={data.timeSlot}
            onChange={(e) => setData({ ...data, timeSlot: e.target.value })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Duration (min)</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            type="number"
            min="0"
            value={data.duration}
            onChange={(e) => setData({ ...data, duration: e.target.value })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Price ($)</label>
          <input
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            type="number"
            min="0"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Status</label>
          <select
            className="border border-slate-200 rounded-md px-3 py-2 flex-1 min-w-[220px]"
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
          >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Rating</label>
          <RatingStars value={data.rating || 0} onChange={(v) => setData({ ...data, rating: v })} />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <label className="w-32 text-sm font-medium">Add-ons</label>
          <AddOnsSelector value={data.addOns} onChange={(v) => setData({ ...data, addOns: v })} />
        </div>

        <div className="flex items-center flex-wrap gap-2 pt-2">
          <button
            className="inline-flex items-center rounded-md bg-sky-500 text-white px-3 py-2 text-sm hover:bg-sky-600 disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}
