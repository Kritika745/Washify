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
  const booking = await Booking.create(req.body)
  res.status(201).json({ success: true, data: booking })
}

export async function updateBooking(req, res) {
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
