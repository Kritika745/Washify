import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import BookingDetail from "./pages/BookingDetail.jsx"
import BookingForm from "./pages/BookingForm.jsx"
import BookingReview from "./components/BookingReview.jsx"
import BookingConfirm from "./components/BookingConfirm.jsx"
import "./index.css"

const root = createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="booking/new" element={<BookingForm mode="create" />} />
          <Route path="booking/:id" element={<BookingDetail />} />
          <Route path="booking/:id/edit" element={<BookingForm mode="edit" />} />
          <Route path="review/:id" element={<BookingReview />} />
          <Route path="confirm/:id" element={<BookingConfirm />} />
          <Route path="confirm/:id/share" element={<BookingConfirm share={true} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
