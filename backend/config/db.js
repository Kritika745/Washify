import mongoose from "mongoose"

export async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error("MONGO_URI not set")

  mongoose.set("strictQuery", true)

  mongoose.connection.on("connected", () => {
    console.log("[db] ✅ Connected to MongoDB")
  })
  mongoose.connection.on("error", (err) => {
    console.error("[db] ❌ MongoDB error:", err.message)
  })
  mongoose.connection.on("disconnected", () => {
    console.log("[db] ⚠️ MongoDB disconnected")
  })

  try {
    console.log("[db] Connecting to MongoDB...")
    await mongoose.connect(uri, { dbName: "carwash" }) // add dbName
    console.log("[db] Connection attempt finished.")
  } catch (err) {
    console.error("[db] Failed to connect to MongoDB:", err.message)
    throw err
  }
}
