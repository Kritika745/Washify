import mongoose from "mongoose"

const CarDetailsSchema = new mongoose.Schema(
  {
    make: { type: String, trim: true, required: true },
    model: { type: String, trim: true, required: true },
    year: { type: Number, min: 1950, max: 2100, required: true },
    type: { type: String, trim: true, required: true }, // sedan, suv, hatchback, luxury
  },
  { _id: false },
)

const BookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    carDetails: { type: CarDetailsSchema, required: true }, // required object with required subfields
    serviceType: {
      type: String,
      enum: ["Basic Wash", "Deluxe Wash", "Full Detailing"],
      required: true,
      default: "Basic Wash",
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, trim: true }, // optional by request
    duration: { type: Number, min: 0, required: true }, // minutes
    price: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      required: true,
      default: "Pending",
    },
    rating: { type: Number, min: 1, max: 5 }, // no longer required
    review: { type: String, trim: true }, // optional
    addOns: [{ type: String, trim: true }], // optional by request
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
