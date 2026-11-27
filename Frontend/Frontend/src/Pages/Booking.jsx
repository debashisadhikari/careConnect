
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../Context/StoreContext";

const MyBookings = () => {
  const { getBook } = useStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBook();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatus = (status) => {
    const value = (status || "Pending").toLowerCase();

    if (value === "confirmed") {
      return {
        label: "Confirmed",
        style: "bg-green-50 text-green-700 border-green-200",
        dot: "bg-green-500",
      };
    }

    if (value === "completed") {
      return {
        label: "Completed",
        style: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    }

    if (value === "cancelled") {
      return {
        label: "Cancelled",
        style: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      };
    }

    return {
      label: status || "Pending",
      style: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-500",
    };
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const text = search.toLowerCase();

      const matchesSearch =
        (booking.TestName || "").toLowerCase().includes(text) ||
        (booking.Testcategory || "").toLowerCase().includes(text) ||
        (booking.HospitalName || "").toLowerCase().includes(text);

      const matchesFilter =
        activeFilter === "All" ||
        (booking.status || "Pending").toLowerCase() ===
          activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [bookings, search, activeFilter]);

  const counts = {
    all: bookings.length,
    pending: bookings.filter(
      (b) => (b.status || "Pending").toLowerCase() === "pending"
    ).length,
    confirmed: bookings.filter(
      (b) => (b.status || "").toLowerCase() === "confirmed"
    ).length,
    completed: bookings.filter(
      (b) => (b.status || "").toLowerCase() === "completed"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">
            Loading your appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-100 font-medium mb-3">
                YOUR HEALTH, YOUR PRIORITY
              </p>

              <h1 className="text-3xl md:text-4xl font-bold">
                My Appointments
              </h1>

              <p className="text-blue-100 mt-3 max-w-xl">
                Keep track of your diagnostic test bookings, hospital
                appointments and booking status in one place.
              </p>
            </div>

            <div className="bg-white/15 border border-white/20 rounded-2xl p-5 min-w-[180px]">
              <p className="text-blue-100 text-sm">Total Bookings</p>
              <p className="text-4xl font-bold mt-1">{counts.all}</p>
              <p className="text-blue-100 text-sm mt-1">
                Your appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-9">

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="All Bookings"
            count={counts.all}
            icon="📋"
            color="blue"
          />
          <StatCard
            label="Pending"
            count={counts.pending}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            label="Confirmed"
            count={counts.confirmed}
            icon="✓"
            color="green"
          />
          <StatCard
            label="Completed"
            count={counts.completed}
            icon="✚"
            color="purple"
          />
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-7">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Your Bookings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View all your diagnostic test appointments.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              className="px-5 py-2.5 rounded-xl border border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by test or hospital name..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
            <button
              onClick={fetchBookings}
              className="ml-3 underline font-semibold"
            >
              Try again
            </button>
          </div>
        )}

        {/* Booking cards */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-4xl">
              🏥
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-5">
              {bookings.length === 0
                ? "No appointments yet"
                : "No matching appointments"}
            </h3>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              {bookings.length === 0
                ? "Your test bookings will appear here after you book an appointment."
                : "Try changing your search or selecting a different filter."}
            </p>

            {bookings.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="mt-5 text-blue-600 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredBookings.map((booking, index) => {
              const status = getStatus(booking.status);

              return (
                <div
                  key={booking._id || index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 overflow-hidden"
                >
                  <div className="p-5 md:p-6">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                          🧪
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 font-medium">
                            DIAGNOSTIC TEST
                          </p>
                          <h3 className="text-lg font-bold text-gray-800">
                            {booking.TestName || "Test Name"}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${status.style}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </div>

                    {/* Hospital */}
                    <div className="mt-6 bg-blue-50/70 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
                          🏥
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-blue-500 font-semibold">
                            HOSPITAL
                          </p>
                          <p className="font-bold text-gray-800 truncate">
                            {booking.HospitalName || "Hospital name unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Appointment Date
                        </p>
                        <p className="font-semibold text-gray-800 text-sm">
                          📅 {formatDate(booking.AppointmentDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Test Category
                        </p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {booking.Testcategory || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Price and action */}
                    <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Test Price</p>
                        <p className="text-2xl font-bold text-blue-700">
                          ₹{booking.Prices || "0"}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    APPOINTMENT DETAILS
                  </p>
                  <h2 className="text-2xl font-bold mt-1">
                    Booking Information
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <Detail
                label="Hospital Name"
                value={selectedBooking.HospitalName}
                icon="🏥"
              />
              <Detail
                label="Test Name"
                value={selectedBooking.TestName}
                icon="🧪"
              />
              <Detail
                label="Test Category"
                value={selectedBooking.Testcategory}
                icon="📋"
              />
              <Detail
                label="Appointment Date"
                value={formatDate(selectedBooking.AppointmentDate)}
                icon="📅"
              />
              <Detail
                label="Test Price"
                value={`₹${selectedBooking.Prices || "0"}`}
                icon="💳"
              />
              <Detail
                label="Booking Status"
                value={getStatus(selectedBooking.status).label}
                icon="✓"
              />
              <Detail
                label="Booking ID"
                value={selectedBooking._id}
                icon="🔖"
              />
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, count, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-3">{count}</p>
    </div>
  );
};

const Detail = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800 mt-1 break-all">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

export default MyBookings;
