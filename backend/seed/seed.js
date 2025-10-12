import dotenv from "dotenv"
dotenv.config()
import { connectDB } from "../config/db.js"
import Booking from "../models/Booking.js"

async function run() {
  await connectDB()
  await Booking.deleteMany({}) // reset

  const samples = [
    {
      customerName: "Alice Johnson",
      carDetails: { make: "Toyota", model: "Camry", year: 2020, type: "sedan" },
      serviceType: "Basic Wash",
      date: new Date(),
      timeSlot: "10:00 - 11:00",
      duration: 60,
      price: 20,
      status: "Pending",
      rating: 4,
      addOns: ["Interior Cleaning"],
    },
    {
      customerName: "Bob Smith",
      carDetails: { make: "BMW", model: "X5", year: 2019, type: "suv" },
      serviceType: "Deluxe Wash",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      timeSlot: "12:00 - 13:00",
      duration: 90,
      price: 45,
      status: "Confirmed",
      rating: 5,
      addOns: ["Polishing"],
    },
    {
      customerName: "Carla Reyes",
      carDetails: { make: "Honda", model: "Civic", year: 2018, type: "hatchback" },
      serviceType: "Full Detailing",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      timeSlot: "09:00 - 11:00",
      duration: 120,
      price: 90,
      status: "Completed",
      rating: 5,
      addOns: ["Interior Cleaning", "Polishing"],
    },
    {
      customerName: "Daniel Wu",
      carDetails: { make: "Mercedes", model: "S-Class", year: 2021, type: "luxury" },
      serviceType: "Deluxe Wash",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      timeSlot: "14:00 - 15:00",
      duration: 75,
      price: 60,
      status: "Pending",
      rating: 3,
      addOns: [],
    },
    {
      customerName: "Eva Green",
      carDetails: { make: "Audi", model: "A4", year: 2017, type: "sedan" },
      serviceType: "Basic Wash",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: "11:00 - 12:00",
      duration: 60,
      price: 25,
      status: "Cancelled",
      rating: 2,
      addOns: [],
    },
  ]

  await Booking.insertMany(samples)
  console.log("[seed] Inserted", samples.length, "bookings")
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
