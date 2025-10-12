import { Link, Outlet, useLocation } from "react-router-dom"

export default function App() {
  const loc = useLocation()
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-sky-500 text-white print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-lg">
            Car Wash Booking
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`rounded-md px-2.5 py-1.5 no-underline text-white/90 hover:text-white hover:bg-white/15 ${
                loc.pathname === "/" ? "bg-white/15" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/booking/new"
              className={`rounded-md px-2.5 py-1.5 no-underline text-white/90 hover:text-white hover:bg-white/15 ${
                loc.pathname === "/booking/new" ? "bg-white/15" : ""
              }`}
            >
              Add Booking
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 mt-6 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <small>© {new Date().getFullYear()} Car Wash Booking</small>
        </div>
      </footer>
    </div>
  )
}
