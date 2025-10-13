"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react";
import api from "../api/axios.js"

export default function BookingConfirm() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const shareUrl = useMemo(() => `${window.location.origin}/confirm/${id}`, [id])

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    api
      .get(`/api/bookings/${id}`)
      .then((res) => !cancel && setData(res.data.data))
      .catch((e) => !cancel && setError(e?.response?.data?.message || e.message))
      .finally(() => !cancel && setLoading(false))
    return () => {
      cancel = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading confirmation…</p>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error || "Booking not found"}</p>
          <Link to="/" className="mt-4 inline-block text-sm text-gray-700 underline">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-gray-900">Booking Confirmation</h1>
          <p className="text-sm text-gray-500">Reference: {data._id}</p>
        </div>
        <div className="rounded-md border bg-white p-3">
          <QRCodeCanvas value={shareUrl} size={120} includeMargin />
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Customer</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Name</div>
              <div className="text-gray-900">{data.customerName}</div>
              <div className="text-gray-500">Phone</div>
              <div className="text-gray-900">{data.phone}</div>
              <div className="text-gray-500">Email</div>
              <div className="text-gray-900">{data.email}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Vehicle</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Make</div>
              <div className="text-gray-900">{data.carDetails?.make}</div>
              <div className="text-gray-500">Model</div>
              <div className="text-gray-900">{data.carDetails?.model}</div>
              <div className="text-gray-500">Year</div>
              <div className="text-gray-900">{data.carDetails?.year}</div>
              <div className="text-gray-500">Plate</div>
              <div className="text-gray-900">{data.carDetails?.plate}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Service</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Type</div>
              <div className="text-gray-900">{data.serviceType}</div>
              <div className="text-gray-500">Date</div>
              <div className="text-gray-900">{data.date ? new Date(data.date).toLocaleString() : "n/a"}</div>
              <div className="text-gray-500">Duration</div>
              <div className="text-gray-900">{data.duration} mins</div>
              <div className="text-gray-500">Time Slot</div>
              <div className="text-gray-900">{data.timeSlot || "—"}</div>
              <div className="text-gray-500">Add-ons</div>
              <div className="text-gray-900">{data.addOns?.length ? data.addOns.join(", ") : "—"}</div>
              <div className="text-gray-500">Status</div>
              <div className="text-gray-900 capitalize">{data.status}</div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Payment</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Price</div>
              <div className="text-gray-900">${Number(data.price || 0).toFixed(2)}</div>
              <div className="text-gray-500">Created</div>
              <div className="text-gray-900">{new Date(data.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Share</h2>
            <p className="mb-3 text-xs text-gray-500 break-all">{shareUrl}</p>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl)
                } catch (e) {
                  console.log("[v0] copy failed", e)
                }
              }}
              className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 active:scale-[0.99]"
            >
              Copy confirmation link
            </button>
          </div>
        </aside>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <Link to={`/bookings/${data._id}`} className="text-sm text-gray-700 underline">
          View full booking details
        </Link>
        <Link to="/" className="text-sm text-gray-700 underline">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
