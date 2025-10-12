import mongoose from "mongoose"

const CarDetailsSchema = new mongoose.Schema(
  {
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    year: { type: Number, min: 1950, max: 2100 },
    type: { type: String, trim: true }, // sedan, suv, hatchback, luxury
  },
  { _id: false },
)

const BookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    carDetails: { type: CarDetailsSchema, default: {} },
    serviceType: {
      type: String,
      enum: ["Basic Wash", "Deluxe Wash", "Full Detailing"],
      default: "Basic Wash",
    },
    date: { type: Date },
    timeSlot: { type: String, trim: true },
    duration: { type: Number, min: 0 }, // minutes
    price: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    rating: { type: Number, min: 1, max: 5 },
    addOns: [{ type: String, trim: true }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

// Text index for search
BookingSchema.index({
  customerName: "text",
  "carDetails.make": "text",
  "carDetails.model": "text",
  "carDetails.type": "text",
  serviceType: "text",
})

// Common filters
BookingSchema.index({ date: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ isDeleted: 1 })

export default mongoose.model("Booking", BookingSchema)
