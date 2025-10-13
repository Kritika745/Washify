"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios.js"

export default function BookingReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await api.get(`/api/bookings/${id}`)
        if (cancel) return
        setBooking(res.data.data)
      } catch (e) {
        if (cancel) return
        setError(e?.response?.data?.message || "Unable to load booking")
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => {
      cancel = true
    }
  }, [id])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const r = Number(rating)
    if (!(r >= 1 && r <= 5)) {
      setError("Please select a rating between 1 and 5.")
      return
    }
    try {
      setSubmitting(true)
      const res = await api.post(`/api/bookings/${id}/review`, { rating: r, review })
      setSuccess(res?.data?.message || "Thank you for your review!")
      setTimeout(() => navigate(`/booking/${id}`), 1000)
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-sm text-gray-500">Loading…</div>
  if (error) return <div className="p-6 text-center text-sm text-red-600">{error}</div>
  if (!booking) return null

  const isCompleted = booking.status === "Completed"

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-balance text-2xl font-semibold text-gray-900">Leave a review</h1>
          <p className="mt-1 text-sm text-gray-600">Booking #{booking._id}</p>

          <section className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Customer</label>
              <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                {booking.customerName}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">Car</label>
                <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {booking.carDetails?.make} {booking.carDetails?.model} ({booking.carDetails?.type || "n/a"})
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Service</label>
                <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {booking.serviceType}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">Date/Time</label>
                <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {booking.date ? new Date(booking.date).toLocaleString() : "n/a"} {booking.timeSlot || ""}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Total</label>
                <div className="mt-1 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  ${Number(booking.price).toFixed(2)}
                </div>
              </div>
            </div>
          </section>

          {!isCompleted ? (
            <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
              This booking is not completed yet. Reviews are available only after completion.
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6">
            <fieldset disabled={!isCompleted} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">Your rating</label>
                <div className="mt-2 inline-flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRating(v)}
                      aria-label={`Rate ${v} out of 5`}
                      className={`text-2xl ${v <= rating ? "text-amber-500" : "text-gray-300"} hover:text-amber-500`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-900">
                  Your review (optional)
                </label>
                <textarea
                  id="review"
                  className="mt-2 w-full resize-y rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  rows={4}
                  placeholder="Tell us about your experience…"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isCompleted}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </fieldset>
          </form>

          {success ? <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{success}</div> : null}
          {error ? <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        </div>
      </div>
    </main>
  )
}
