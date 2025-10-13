// src/pages/BookingDetail.jsx
"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Edit, Trash2, Printer, Copy, Star, Calendar, Clock, Layers, CheckCircle } from 'lucide-react'
import api from "../api/axios.js"
import RatingStars from "../components/RatingStars.jsx"; 

// A reusable Detail Item component for consistency
const DetailItem = ({ icon, label, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-50 rounded-full text-sky-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-800">{children}</p>
    </div>
  </div>
)

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

  useEffect(() => {
    if (!data) return
    const base = window.location.origin
    // const url = data.status === "Completed" ? `${base}/review/${data._id}` : `${base}/booking/${data._id}`
    // const isConfirmed = data.status === "Confirmed"
    // const url = isConfirmed ? `${base}/confirm/${data._id}` : ""

    let url = `${base}/booking/${data._id}`; 
    
    // 2. Conditionally override the default.
    if (data.status === "Completed") {
      url = `${base}/review/${data._id}`;
    } else if (data.status === "Confirmed") {
      url = `${base}/confirm/${data._id}`;
    }

    setShareUrl(url)
  }, [data])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    try {
      await api.delete(`/api/bookings/${id}`)
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

  const statusColors = {
    Pending: "bg-orange-100 text-orange-800 border-orange-200",
    Confirmed: "bg-sky-100 text-sky-800 border-sky-200",
    Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  }
  
  if (loading) return <p className="p-6 text-center text-slate-500">Loading booking details...</p>
  if (error) return <p className="p-6 text-red-600 font-medium text-center">{error}</p>
  if (!data) return null

  return (
    <div className="bg-slate-50 min-h-screen p-6 print:p-0">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">Booking Details</h1>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[data.status] || "bg-slate-100"}`}>
                          {data.status}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-mono">{data._id}</p>
                </div>
            </div>
          <div className="flex items-center gap-2">
            <Link to={`/booking/${data._id}/edit`} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-100 transition-colors"> <Edit size={16} /> Edit </Link>
            <button onClick={handleDelete} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-rose-600 bg-white border border-slate-300 rounded-lg px-4 py-2 hover:bg-rose-50 transition-colors"> <Trash2 size={16} /> Delete </button>
            <button onClick={printInvoice} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-sky-500 border border-sky-500 rounded-lg px-4 py-2 hover:bg-sky-600 transition-colors"> <Printer size={16} /> Print Invoice </button>
            {data.status === "Completed" && !data.rating ? (
             <Link
            className="inline-flex items-center rounded-md bg-amber-500 text-white px-3 py-2 text-sm hover:bg-amber-600"
            to={`/review/${data._id}`}
            >
            Leave Review
            </Link>
        ) : null}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Service for {data.customerName}
            </h2>
            <p className="text-slate-500 mb-6">
               {data.carDetails?.make} {data.carDetails?.model} ({data.carDetails?.year || "N/A"}, {data.carDetails?.type || "N/A"})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <DetailItem label="Service Type" icon={<Layers size={16}/>}>{data.serviceType}</DetailItem>
                <DetailItem label="Date" icon={<Calendar size={16}/>}>{data.date ? new Date(data.date).toLocaleDateString() : "N/A"}</DetailItem>
                <DetailItem label="Time Slot" icon={<Clock size={16}/>}>{data.timeSlot || "N/A"}</DetailItem>
                <DetailItem label="Duration" icon={<CheckCircle size={16}/>}>{data.duration} minutes</DetailItem>
                <DetailItem label="Add-ons" icon={<Layers size={16}/>}>{(data.addOns || []).join(", ") || "None"}</DetailItem>
                <DetailItem label="Rating" icon={<Star size={16}/>}>
                    {data.status === "Completed" && data.rating ? (
                      <RatingStars value={data.rating} readOnly />
                    ) : (
                      <span className="text-slate-400">No review yet</span>
                    )}
                </DetailItem>
            </div>
            
            {/* Invoice Section for Printing */}
             <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Invoice Summary</h3>
                <div className="mt-4 flow-root">
                    <dl className="-my-4 divide-y divide-slate-100 text-sm">
                        <div className="flex items-center justify-between py-4">
                            <dt className="text-slate-600">Service ({data.serviceType})</dt>
                            <dd className="font-medium text-slate-900">${data.price}</dd>
                        </div>
                         <div className="flex items-center justify-between py-4">
                            <dt className="text-slate-600">Add-ons</dt>
                            <dd className="font-medium text-slate-900">$0.00</dd> {/* Example: Add logic if addons have cost */}
                        </div>
                        <div className="flex items-center justify-between py-4">
                            <dt className="text-base font-semibold text-slate-900">Total Amount</dt>
                            <dd className="text-base font-semibold text-slate-900">${data.price}</dd>
                        </div>
                    </dl>
                </div>
             </div>
          </div>
          
          {/* Right Column: QR & Meta */}
          {data.status === "Confirmed" || data.status === "Completed"  ? (
          <div className="space-y-6 print:hidden">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center">
                 <h3 className="mb-2 font-semibold">{data.status === "Completed" ? "Share Review Link" : "Share Confirmation"}</h3>                 
                 <div className="inline-block p-2 border border-slate-200 rounded-lg bg-white">
                    <QRCodeCanvas value={shareUrl} size={160} includeMargin />
                 </div>
                 <div className="mt-4 flex items-center gap-2">
                  <a href={shareUrl}  rel="noopener noreferrer"
                      className="flex-1 w-full truncate text-xs border border-slate-300 rounded-md px-3 py-2 text-sky-500 hover:text-sky-600 transition-colors"
                      >
                        {shareUrl}
                      </a>                    
                      <button onClick={copyShare} className="p-2 rounded-md border border-slate-300 hover:bg-slate-100">
                        <Copy size={16} className="text-slate-600" />
                    </button>
                 </div>
              </div>
          </div>
           ) : null}
        </div>
          </div>   
    </div>
  )
}