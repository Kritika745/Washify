"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Star } from "lucide-react"
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
        // Pre-fill fields if a review already exists
        if (res.data.data.rating) setRating(res.data.data.rating)
        if (res.data.data.review) setReview(res.data.data.review)
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
      setTimeout(() => navigate(`/booking/${id}`), 1500) // Slightly longer delay to read the message
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-slate-500">Loading…</div>
  if (error && !booking) return <div className="p-6 text-center text-red-600 font-medium">{error}</div>
  if (!booking) return null

  const isCompleted = booking.status === "Completed"

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/booking/${id}`} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leave a Review</h1>
            <p className="text-slate-500 text-sm">Share your feedback for Booking #{booking._id}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="font-semibold text-slate-800">Service Details</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Customer</p>
                <p className="font-medium text-slate-800">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Service</p>
                <p className="font-medium text-slate-800">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Car</p>
                <p className="font-medium text-slate-800">
                  {booking.carDetails?.make} {booking.carDetails?.model} ({booking.carDetails?.year || "n/a"})
                </p>
              </div>
               <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="font-medium text-slate-800">
                  {booking.date ? new Date(booking.date).toLocaleDateString() : "n/a"}
                </p>
              </div>
            </div>
          </div>

          {!isCompleted ? (
            <div className="border-t border-slate-200 p-6">
              <div className="rounded-lg bg-sky-50 p-4 text-sm text-sky-800 border border-sky-200">
                This booking is not completed yet. Reviews are only available for completed services.
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="border-t border-slate-200 p-6 space-y-5">
                <fieldset disabled={!isCompleted}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Your Rating*</label>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          aria-label={`Rate ${v} out of 5`}
                          className="group p-1"
                        >
                           <Star size={24} className={`transition-colors ${v <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300 group-hover:text-yellow-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="review" className="block text-sm font-medium text-slate-700">
                      Your Review (optional)
                    </label>
                    <textarea
                      id="review"
                      className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                      rows={4}
                      placeholder="Tell us about your experience…"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>
                </fieldset>
                
                {error && <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
                {success && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

              </div>

              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/booking/${id}`)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isCompleted}
                  className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-600 disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
