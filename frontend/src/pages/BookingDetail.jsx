"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react";
import api from "../api/axios.js"
import RatingStars from "../components/RatingStars.jsx"

function badgeClass(status) {
  const s = status?.toLowerCase()
  const base = "px-2 py-0.5 rounded-full text-xs border border-slate-200"
  if (s === "pending") return `${base} bg-orange-50`
  if (s === "confirmed") return `${base} bg-sky-50`
  if (s === "completed") return `${base} bg-emerald-50`
  if (s === "cancelled") return `${base} bg-rose-50`
  return base
}

export default function BookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [shareUrl, setShareUrl] = useState(window.location.href)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    api
      .get(`/api/bookings/${id}`)
      .then((res) => !cancel && setData(res.data.data))
      .catch((e) => !cancel && setError(e?.response?.data?.message || e.message))
      .finally(() => !cancel && setLoading(false))
    return () => (cancel = true)
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    try {
      await api.delete(`/api/bookings/${id}`) // soft delete
      navigate("/")
    } catch (e) {
      alert(e?.response?.data?.message || e.message)
    }
  }

  const printInvoice = () => window.print()

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert("Link copied!")
    } catch {
      alert("Failed to copy")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (!data) return null

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="m-0 font-semibold">Booking Detail</h2>
        <span className={badgeClass(data.status)}>{data.status}</span>
      </div>

      <div className="h-2" />

      <p>
        <strong>Customer:</strong> {data.customerName}
      </p>
      <p>
        <strong>Car:</strong> {data.carDetails?.make} {data.carDetails?.model} ({data.carDetails?.year || "n/a"},{" "}
        {data.carDetails?.type || "n/a"})
      </p>
      <p>
        <strong>Service:</strong> {data.serviceType}
      </p>
      <p>
        <strong>Date/Time:</strong> {data.date ? new Date(data.date).toLocaleString() : "n/a"} {data.timeSlot || ""}
      </p>
      <p>
        <strong>Duration:</strong> {data.duration} min
      </p>
      <p>
        <strong>Price:</strong> ${data.price}
      </p>
      <p className="flex items-center gap-2">
        <strong>Rating:</strong> <RatingStars value={data.rating || 0} readOnly />
      </p>
      <p>
        <strong>Add-ons:</strong> {(data.addOns || []).join(", ") || "None"}
      </p>

      <div className="mt-4 flex items-center gap-2 flex-wrap print:hidden">
        <Link
          className="inline-flex items-center rounded-md bg-sky-500 text-white px-3 py-2 text-sm hover:bg-sky-600"
          to={`/booking/${data._id}/edit`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center rounded-md bg-rose-500 text-white px-3 py-2 text-sm hover:bg-rose-600"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="inline-flex items-center rounded-md bg-emerald-500 text-white px-3 py-2 text-sm hover:bg-emerald-600"
          onClick={printInvoice}
        >
          Print Invoice
        </button>
      </div>

      <div className="mt-4 border border-dashed border-slate-300 rounded-lg p-4 bg-white print:border-0">
        <h3 className="mb-2 font-semibold">Invoice</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Customer</th>
              <td className="border-b border-slate-200 p-2">{data.customerName}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Service</th>
              <td className="border-b border-slate-200 p-2">{data.serviceType}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Date</th>
              <td className="border-b border-slate-200 p-2">
                {data.date ? new Date(data.date).toLocaleDateString() : "n/a"}
              </td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Time Slot</th>
              <td className="border-b border-slate-200 p-2">{data.timeSlot || "n/a"}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Duration</th>
              <td className="border-b border-slate-200 p-2">{data.duration} minutes</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Add-ons</th>
              <td className="border-b border-slate-200 p-2">{(data.addOns || []).join(", ") || "None"}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Status</th>
              <td className="border-b border-slate-200 p-2">{data.status}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Total</th>
              <td className="border-b border-slate-200 p-2">${data.price}</td>
            </tr>
            <tr>
              <th className="border-b border-slate-200 p-2 text-left">Booking ID</th>
              <td className="border-b border-slate-200 p-2">{data._id}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 print:hidden">
        <h3 className="mb-2 font-semibold">Share Booking</h3>
        <div className="flex items-center gap-2">
          <input className="flex-1 border border-slate-200 rounded-md px-3 py-2" value={shareUrl} readOnly />
          <button
            className="inline-flex items-center rounded-md border border-slate-200 text-slate-900 bg-transparent px-3 py-2 text-sm hover:bg-slate-50"
            onClick={copyShare}
          >
            Copy
          </button>
        </div>
        <div className="mt-4 inline-block p-2 border border-slate-200 rounded-lg bg-white">
          <QRCodeCanvas value={shareUrl} size={140} includeMargin />
        </div>
      </div>
    </div>
  )
}
