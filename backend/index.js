import express from "express"
import morgan from "morgan"
import { connectDB } from "./config/db.js" 
import cors from "cors"
import bookingsRouter from "./routes/bookings.js"
import { notFound, errorHandler } from "./middlewares/errorHandler.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(morgan("dev"))

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "https://washify-r8o1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "car-wash-booking-api" })
})

app.use("/api/bookings", bookingsRouter)

// Not found and error middleware
app.use(notFound)
app.use(errorHandler)

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB:", err)
    process.exit(1)
  })

export default app
