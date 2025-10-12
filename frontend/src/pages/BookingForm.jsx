// src/pages/BookingForm.jsx
"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import api from "../api/axios.js"
import AddOnsSelector from "../components/AddOnsSelector.jsx"
import RatingStars from "../components/RatingStars.jsx"

// A reusable form field component for consistency
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
    {children}
  </div>
)

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
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={mode === "edit" ? `/booking/${id}` : "/"} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === "edit" ? "Edit Booking" : "Create New Booking"}
            </h1>
            <p className="text-slate-500 text-sm">Fill in the details below to schedule the service.</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm">
          {error && <p className="text-red-600 p-4 text-center font-medium border-b border-slate-200">{error}</p>}
          
          <div className="p-6 space-y-6">
            {/* --- Customer & Car Details --- */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="font-semibold text-slate-800 text-lg mb-2 col-span-full">Customer & Car Details</legend>
              <FormField label="Customer Name*">
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none"
                  required
                  value={data.customerName}
                  onChange={(e) => setData({ ...data, customerName: e.target.value })}
                />
              </FormField>
              <div /> {/* Spacer */}
              <FormField label="Car Make">
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none"
                  value={data.carDetails.make}
                  onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, make: e.target.value } })}
                />
              </FormField>
              <FormField label="Car Model">
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none"
                  value={data.carDetails.model}
                  onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, model: e.target.value } })}
                />
              </FormField>
              <FormField label="Car Year">
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none"
                  type="number"
                  value={data.carDetails.year}
                  onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, year: e.target.value } })}
                />
              </FormField>
              <FormField label="Car Type">
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none"
                  value={data.carDetails.type}
                  onChange={(e) => setData({ ...data, carDetails: { ...data.carDetails, type: e.target.value } })}
                >
                  <option value="">Select</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="luxury">Luxury</option>
                </select>
              </FormField>
            </fieldset>

            <div className="border-t border-slate-200"></div>

            {/* --- Service & Schedule --- */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="font-semibold text-slate-800 text-lg mb-2 col-span-full">Service & Schedule</legend>
              <FormField label="Service Type">
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" value={data.serviceType} onChange={(e) => setData({ ...data, serviceType: e.target.value })}>
                  <option>Basic Wash</option>
                  <option>Deluxe Wash</option>
                  <option>Full Detailing</option>
                </select>
              </FormField>
              <FormField label="Add-ons">
                <AddOnsSelector value={data.addOns} onChange={(v) => setData({ ...data, addOns: v })} />
              </FormField>
              <FormField label="Date">
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
              </FormField>
              <FormField label="Time Slot">
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" placeholder="e.g. 10:00 AM - 11:00 AM" value={data.timeSlot} onChange={(e) => setData({ ...data, timeSlot: e.target.value })} />
              </FormField>
            </fieldset>

             <div className="border-t border-slate-200"></div>

            {/* --- Pricing & Status --- */}
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="font-semibold text-slate-800 text-lg mb-2 col-span-full">Pricing & Status</legend>
              <FormField label="Price ($)">
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" type="number" min="0" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
              </FormField>
              <FormField label="Duration (minutes)">
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" type="number" min="0" value={data.duration} onChange={(e) => setData({ ...data, duration: e.target.value })} />
              </FormField>
              <FormField label="Status">
                 <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </FormField>
               <FormField label="Rating">
                <RatingStars value={data.rating || 0} onChange={(v) => setData({ ...data, rating: v })} />
              </FormField>
            </fieldset>
          </div>

          {/* Form Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl flex justify-end items-center gap-3">
            <Link to={mode === "edit" ? `/booking/${id}` : "/"} className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-600 disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}