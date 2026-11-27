
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../Context/StoreContext";

const BookingPage = () => {
  const { getBookAll, editBook } = useStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] = useState(null);

  // GET ALL BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBookAll();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // FILTER BOOKINGS
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (booking.UserName || "").toLowerCase().includes(searchText) ||
        (booking.UserPhone || "").toLowerCase().includes(searchText) ||
        (booking.TestName || "").toLowerCase().includes(searchText) ||
        (booking.Testcategory || "").toLowerCase().includes(searchText) ||
        (booking.UserId || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (booking.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // UPDATE ONLY STATUS
  const handleStatusUpdate = async () => {
    try {
      setSaving(true);

      await editBook({
        _id: selectedBooking._id,
        status: selectedBooking.status,
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, status: selectedBooking.status }
            : booking
        )
      );

      setSelectedBooking(null);
      alert("Booking status updated successfully!");

    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to update booking status.");
    } finally {
      setSaving(false);
    }
  };

  // STATUS COLORS
  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "Not selected";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">
          Loading bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manage Bookings
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage all test appointment bookings.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Bookings
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-800">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-600">
              {bookings.filter(
                (b) => b.status?.toLowerCase() === "pending"
              ).length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Confirmed</p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {bookings.filter(
                (b) => b.status?.toLowerCase() === "confirmed"
              ).length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">Completed</p>
            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {bookings.filter(
                (b) => b.status?.toLowerCase() === "completed"
              ).length}
            </h2>
          </div>

        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search by user, phone, test name or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          <div className="p-5 border-b flex justify-between items-center">

            <h2 className="font-bold text-lg text-gray-800">
              Booking Records
            </h2>

            <span className="text-sm text-gray-500">
              {filteredBookings.length} records
            </span>

          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-medium">
                No bookings found.
              </p>
            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left min-w-[1000px]">

                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Hospital</th>
                    <th className="p-4">Test Details</th>
                    <th className="p-4">Appointment Date</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredBookings.map((booking) => (

                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="p-4">
                        <p className="font-semibold text-gray-800">
                          {booking.UserName || "N/A"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.UserPhone || "N/A"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          User ID: {booking.UserId || "N/A"}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {booking.HospitalName || "N/A"}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-gray-800">
                          {booking.TestName || "N/A"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.Testcategory || "N/A"}
                        </p>
                      </td>

                      <td className="p-4 text-gray-700">
                        {formatDate(booking.AppointmentDate)}
                      </td>

                      <td className="p-4 font-semibold text-gray-800">
                        ₹{booking.Prices || "0"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedBooking({ ...booking })}
                          className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                        >
                          Edit Status
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>

            </div>

          )}

        </div>
      </div>

      {/* EDIT STATUS MODAL */}
      {selectedBooking && (

        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !saving && setSelectedBooking(null)}
        >

          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="p-6 border-b flex justify-between items-center">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Booking Status
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Booking ID: {selectedBooking._id}
                </p>
              </div>

              <button
                disabled={saving}
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>

            </div>

            {/* BOOKING DETAILS */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

              {[
                ["Patient Name", selectedBooking.UserName],
                ["Phone Number", selectedBooking.UserPhone],
                ["User ID", selectedBooking.UserId],
                ["Hospital", selectedBooking.HospitalName],
                ["Test Name", selectedBooking.TestName],
                ["Test Category", selectedBooking.Testcategory],
                ["Price", `₹${selectedBooking.Prices || "0"}`],
                ["Appointment Date", formatDate(selectedBooking.AppointmentDate)],
              ].map(([label, value]) => (

                <div key={label} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    {label}
                  </p>

                  <p className="font-semibold text-gray-800 break-all">
                    {value || "N/A"}
                  </p>
                </div>

              ))}

              {/* ONLY EDITABLE FIELD: STATUS */}
              <div className="sm:col-span-2 bg-blue-50 p-4 rounded-lg">

                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Update Booking Status
                </label>

                <select
                  value={selectedBooking.status || "Pending"}
                  onChange={(e) =>
                    setSelectedBooking((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 pb-6 flex gap-3">

              <button
                disabled={saving}
                onClick={() => setSelectedBooking(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleStatusUpdate}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Status"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingPage;
