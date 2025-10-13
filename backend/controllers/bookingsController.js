import Booking from "../models/Booking.model.js"
import { buildFilters, buildSort } from "../utils/buildQuery.js"

export async function listBookings(req, res) {
  const { page = 1, limit = 10, q, sortBy = "createdAt", order = "desc" } = req.query

  const filters = buildFilters(req.query)
  let query = Booking.find(filters)

  if (q && q.trim()) {
    query = Booking.find({
      ...filters,
      $text: { $search: q.trim() },
    })
  }

  const totalItems = await Booking.countDocuments(query.getFilter())
  const currPage = Number(page)
  const perPage = Math.min(Math.max(Number(limit), 1), 50)
  const skip = (currPage - 1) * perPage

  const data = await query.sort(buildSort(sortBy, order)).skip(skip).limit(perPage).lean()

  res.json({
    success: true,
    data,
    page: currPage,
    limit: perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasNext: skip + data.length < totalItems,
    hasPrev: currPage > 1,
  })
}

export async function searchBookings(req, res) {
  // proxy to list with q
  req.query.q = req.query.q || ""
  return listBookings(req, res)
}

export async function getBooking(req, res) {
  const booking = await Booking.findById(req.params.id).lean()
  if (!booking || booking.isDeleted) {
    res.status(404)
    throw new Error("Booking not found")
  }
  res.json({ success: true, data: booking })
}

export async function createBooking(req, res) {
  const { rating, review, ...body } = req.body || {}
  const booking = await Booking.create(body)
  res.status(201).json({ success: true, data: booking })
}

export async function updateBooking(req, res) {
  if (
    Object.prototype.hasOwnProperty.call(req.body, "rating") ||
    Object.prototype.hasOwnProperty.call(req.body, "review")
  ) {
    const current = await Booking.findById(req.params.id).select("status isDeleted").lean()
    if (!current || current.isDeleted) {
      res.status(404)
      throw new Error("Booking not found or deleted")
    }
    if (current.status !== "Completed") {
      res.status(400)
      throw new Error("Rating and review can only be set for Completed bookings")
    }
    // If rating present, validate bounds on server as safety net
    if (req.body.rating != null) {
      const r = Number(req.body.rating)
      if (!(r >= 1 && r <= 5)) {
        res.status(400)
        throw new Error("Rating must be between 1 and 5")
      }
    }
  }

  const updated = await Booking.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $set: req.body },
    { new: true, runValidators: true },
  )
  if (!updated) {
    res.status(404)
    throw new Error("Booking not found or deleted")
  }
  res.json({ success: true, data: updated })
}

export async function deleteBooking(req, res) {
  const hard = req.query.hard === "true"
  if (hard) {
    const deleted = await Booking.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404)
      throw new Error("Booking not found")
    }
    return res.json({ success: true, message: "Booking hard-deleted" })
  }

  const soft = await Booking.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() }, { new: true })
  if (!soft) {
    res.status(404)
    throw new Error("Booking not found")
  }
  res.json({ success: true, message: "Booking soft-deleted" })
}

export async function addReview(req, res) {
  const { id } = req.params
  const { rating, review } = req.body || {}

  const booking = await Booking.findById(id)
  if (!booking || booking.isDeleted) {
    res.status(404)
    throw new Error("Booking not found")
  }
  if (booking.status !== "Completed") {
    res.status(400)
    throw new Error("Cannot add review: booking is not Completed")
  }

  const r = Number(rating)
  if (!(r >= 1 && r <= 5)) {
    res.status(400)
    throw new Error("Rating must be between 1 and 5")
  }

  booking.rating = r
  booking.review = typeof review === "string" ? review.trim() : booking.review
  await booking.save()

  res.json({ success: true, message: "Review saved", data: { rating: booking.rating, review: booking.review } })
}
