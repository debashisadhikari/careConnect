
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";

const AdminHome = () => {
  const { getDoctor, getCount } = useStore();

  const [doctors, setDoctors] = useState([]);
  const [count, setCount] = useState({
    doctorCnt: 0,
    testCnt: 0,
    appointmentCnt: 0,
  });

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH DOCTORS AND COUNT
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [doctorData, countData] = await Promise.all([
          getDoctor(),
          getCount(),
        ]);

        // Handle different possible API response structures
        const doctorList =
          Array.isArray(doctorData)
            ? doctorData
            : doctorData?.doctors ||
              doctorData?.doctor ||
              doctorData?.data?.doctors ||
              doctorData?.data?.doctor ||
              [];

        const countInfo =
          countData?.count ||
          countData?.data?.count ||
          countData?.data ||
          countData ||
          {};

        setDoctors(Array.isArray(doctorList) ? doctorList : []);

        setCount({
          doctorCnt: countInfo.doctorCnt || 0,
          testCnt: countInfo.testCnt || 0,
          appointmentCnt: countInfo.appointmentCnt || 0,
        });
      } catch (err) {
        console.error("Dashboard fetching error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // GET UNIQUE SPECIALIZATIONS
  const specializations = [
    "All",
    ...new Set(
      doctors
        .map((doctor) => doctor.specialization)
        .filter(Boolean)
    ),
  ];

  // SEARCH AND FILTER DOCTORS
  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.doctorName?.toLowerCase().includes(searchText) ||
      doctor.specialization?.toLowerCase().includes(searchText) ||
      doctor.qualification?.toLowerCase().includes(searchText) ||
      doctor.email?.toLowerCase().includes(searchText);

    const matchesType =
      selectedType === "All" ||
      doctor.specialization === selectedType;

    return matchesSearch && matchesType;
  });

  // DASHBOARD STATISTICS
  const stats = [
    {
      title: "Total Doctors",
      value: count.doctorCnt,
      icon: "👨‍⚕️",
      color: "bg-purple-50 text-purple-600",
      description: "Registered doctors",
    },
    {
      title: "Total Diagnostic Tests",
      value: count.testCnt,
      icon: "🧪",
      color: "bg-blue-50 text-blue-600",
      description: "Available hospital tests",
    },
    {
      title: "Total Appointments",
      value: count.appointmentCnt,
      icon: "📅",
      color: "bg-green-50 text-green-600",
      description: "Patient appointments",
    },
  ];

  return (
    <div className="w-full min-w-0 max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 py-6 space-y-7">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            HOSPITAL ADMIN PANEL
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            Dashboard Overview
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Monitor your hospital doctors, tests and appointments.
          </p>
        </div>

        <Link
          to="/admin/add-doctor"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
        >
          <span className="text-xl">+</span>
          Add Doctor
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-3">
                  {loading ? "..." : item.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.color}`}
              >
                {item.icon}
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              {item.description}
            </p>
          </div>
        ))}

      </div>

      {/* DOCTOR DIRECTORY */}
      <section>

        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Hospital Doctors
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View and search your registered doctors.
            </p>
          </div>

          <p className="text-sm font-semibold text-slate-600">
            {loading ? "Loading..." : `${filteredDoctors.length} Doctors Found`}
          </p>

        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* SEARCH */}
            <div className="md:col-span-2 relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor name, specialization, qualification..."
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
              />

            </div>

            {/* SPECIALIZATION FILTER */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            >
              {specializations.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Specializations" : type}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* DOCTOR CARDS */}
        {loading ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-500">
              Loading doctors...
            </p>
          </div>

        ) : filteredDoctors.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-3">
              👨‍⚕️
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No Doctors Found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {doctors.length === 0
                ? "No doctors have been registered yet."
                : "Try changing your search or specialization filter."}
            </p>

            {doctors.length === 0 && (
              <Link
                to="/admin/add-doctor"
                className="inline-block mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm"
              >
                Add Your First Doctor
              </Link>
            )}

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredDoctors.map((doctor, index) => (

              <div
                key={doctor._id || doctor.registrationNumber || index}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >

                {/* DOCTOR CARD HEADER */}
                <div className="p-5 border-b border-slate-100">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                        👨‍⚕️
                      </div>

                      <div className="min-w-0">

                        <h3 className="font-bold text-slate-800 text-base truncate">
                          {doctor.doctorName}
                        </h3>

                        <p className="text-sm text-blue-600 font-semibold mt-1">
                          {doctor.specialization}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        doctor.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doctor.status || "Inactive"}
                    </span>

                  </div>

                  <p className="text-xs text-slate-500 mt-4">
                    {doctor.qualification || "Qualification not provided"}
                  </p>

                </div>

                {/* DOCTOR DETAILS */}
                <div className="p-5 space-y-4">

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-slate-400">
                        Experience
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {doctor.experience ?? 0} Years
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Consultation Fee
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        ₹{doctor.consultationFee ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Room Number
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {doctor.room || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Appointment Duration
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {doctor.duration ?? 30} Minutes
                      </p>
                    </div>

                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">

                    <div className="flex items-start gap-2">
                      <span>📧</span>

                      <p className="text-xs text-slate-600 break-all">
                        {doctor.email || "Email not provided"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📞</span>

                      <p className="text-xs text-slate-600">
                        {doctor.phone || "Phone not provided"}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span>🕒</span>

                      <p className="text-xs text-slate-600">
                        {doctor.startTime || "--"} - {doctor.endTime || "--"}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span>📅</span>

                      <p className="text-xs text-slate-600">
                        {doctor.availableDays?.length
                          ? doctor.availableDays.join(", ")
                          : "Availability not provided"}
                      </p>
                    </div>

                  </div>

                  {doctor.languages && (
                    <div className="border-t border-slate-100 pt-3">

                      <p className="text-xs text-slate-400 mb-1">
                        Languages
                      </p>

                      <p className="text-sm text-slate-700">
                        {doctor.languages}
                      </p>

                    </div>
                  )}

                  {doctor.about && (
                    <div className="border-t border-slate-100 pt-3">

                      <p className="text-xs text-slate-400 mb-1">
                        About Doctor
                      </p>

                      <p className="text-sm text-slate-600 leading-6 line-clamp-3">
                        {doctor.about}
                      </p>

                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default AdminHome;
