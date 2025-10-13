import express from "express"
import { body, param, query } from "express-validator"
import {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  searchBookings,
  addReview,
} from "../controllers/bookingsController.js"
import { validate } from "../middlewares/validate.js"

const router = express.Router()

// GET /api/bookings - list with filters/pagination/sorting
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("sortBy").optional().isIn(["createdAt", "date", "price", "duration", "status"]),
    query("order").optional().isIn(["asc", "desc"]),
  ],
  validate,
  listBookings,
)

// GET /api/bookings/search?q=...
router.get(
  "/search",
  [query("q").optional().isString().trim().isLength({ min: 0, max: 100 })],
  validate,
  searchBookings,
)

// GET /api/bookings/:id
router.get("/:id", [param("id").isMongoId()], validate, getBooking)

// POST /api/bookings
router.post(
  "/",
  [
    body("customerName").exists().withMessage("customerName is required").isString().trim().notEmpty(),

    body("carDetails.make").exists().withMessage("carDetails.make is required").isString().trim().notEmpty(),
    body("carDetails.model").exists().withMessage("carDetails.model is required").isString().trim().notEmpty(),
    body("carDetails.year").exists().withMessage("carDetails.year is required").isInt({ min: 1950, max: 2100 }),
    body("carDetails.type").exists().withMessage("carDetails.type is required").isString().trim().notEmpty(),

    body("serviceType")
      .exists()
      .withMessage("serviceType is required")
      .isIn(["Basic Wash", "Deluxe Wash", "Full Detailing"]),
    body("date").exists().withMessage("date is required").isISO8601(),
    body("timeSlot").optional().isString().trim(),
    body("duration").exists().withMessage("duration is required").isInt({ min: 0 }),
    body("price").exists().withMessage("price is required").isFloat({ min: 0 }),
    body("status").exists().withMessage("status is required").isIn(["Pending", "Confirmed", "Completed", "Cancelled"]),
    body("rating").not().exists().withMessage("rating cannot be set at creation"),
    body("review").not().exists().withMessage("review cannot be set at creation"),
    body("addOns").optional().isArray(),
  ],
  validate,
  createBooking,
)

// PUT /api/bookings/:id
router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("customerName").optional().isString().trim().notEmpty(),
    body("carDetails.make").optional().isString().trim(),
    body("carDetails.model").optional().isString().trim(),
    body("carDetails.year").optional().isInt({ min: 1950, max: 2100 }),
    body("carDetails.type").optional().isString().trim(),
    body("serviceType").optional().isIn(["Basic Wash", "Deluxe Wash", "Full Detailing"]),
    body("date").optional().isISO8601(),
    body("timeSlot").optional().isString().trim(),
    body("duration").optional().isInt({ min: 0 }),
    body("price").optional().isFloat({ min: 0 }),
    body("status").optional().isIn(["Pending", "Confirmed", "Completed", "Cancelled"]),
    body("rating").optional().isInt({ min: 1, max: 5 }),
    body("addOns").optional().isArray(),
  ],
  validate,
  updateBooking,
)

// DELETE /api/bookings/:id?hard=true
router.delete("/:id", [param("id").isMongoId()], validate, deleteBooking)

// POST /api/bookings/:id/review
router.post(
  "/:id/review",
  [
    param("id").isMongoId(),
    body("rating").exists().withMessage("rating is required").isInt({ min: 1, max: 5 }),
    body("review").optional().isString().trim().isLength({ max: 1000 }),
  ],
  validate,
  addReview,
)

export default router
