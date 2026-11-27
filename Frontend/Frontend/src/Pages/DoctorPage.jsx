
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../Context/StoreContext";

const Doctor = () => {
  const { getAllDoctor } = useStore();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctor();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specializations = useMemo(() => {
    return [
      "All",
      ...new Set(
        doctors.map(d => d.specialization).filter(Boolean)
      ),
    ];
  }, [doctors]);

  const filteredDoctors = doctors.filter(doctor => {
    const query = search.toLowerCase();

    const matchesSearch =
      doctor.doctorName?.toLowerCase().includes(query) ||
      doctor.HospitalName?.toLowerCase().includes(query) ||
      doctor.specialization?.toLowerCase().includes(query);

    const matchesSpecialization =
      specialization === "All" ||
      doctor.specialization === specialization;

    return (
      matchesSearch &&
      matchesSpecialization &&
      doctor.status === "Active"
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-500">Finding doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white px-5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-100 font-semibold tracking-widest text-sm mb-3">
            YOUR HEALTH, OUR PRIORITY
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-tight">
            Find the Right Doctor for Your Health
          </h1>

          <p className="text-blue-100 mt-5 max-w-xl text-base sm:text-lg">
            Explore experienced doctors from different hospitals.
            Compare specializations, consultation fees and availability.
          </p>

          <div className="mt-8 flex flex-wrap gap-5 text-sm">
            <span>✓ Verified Doctor Information</span>
            <span>✓ Multiple Specializations</span>
            <span>✓ Easy Appointment Discovery</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Explore Our Doctors
            </h2>
            <p className="text-slate-500 mt-2">
              Find specialists who can help you stay healthy.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {filteredDoctors.length} doctors available
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Search doctors
              </label>

              <input
                type="text"
                placeholder="Doctor name, hospital or specialization..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Specialization
              </label>

              <select
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specializations.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredDoctors.map(doctor => (

            <div
              key={doctor._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >

              {/* Doctor Header */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold shrink-0">
                    {doctor.doctorName?.charAt(0)?.toUpperCase() || "D"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 truncate">
                      Dr. {doctor.doctorName}
                    </h3>

                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {doctor.specialization}
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                  <span>🏥</span>
                  <span className="font-medium">
                    {doctor.HospitalName}
                  </span>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="p-6">

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-400">Qualification</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {doctor.qualification}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Experience</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {doctor.experience} Years
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Consultation Fee</p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      ₹{doctor.consultationFee}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Consultation</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {doctor.duration} Minutes
                    </p>
                  </div>

                </div>

                {/* Availability */}
                <div className="border-t border-slate-100 mt-5 pt-5">

                  <p className="text-xs font-bold text-slate-400 mb-3">
                    AVAILABLE DAYS
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {doctor.availableDays?.length > 0 ? (
                      doctor.availableDays.map(day => (
                        <span
                          key={day}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-700"
                        >
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        Schedule not available
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-slate-500">
                      Consultation Hours
                    </span>
                    <span className="font-semibold text-slate-700">
                      {doctor.startTime} - {doctor.endTime}
                    </span>
                  </div>

                </div>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-slate-100">

                  <p className="text-xs text-slate-400 mb-1">
                    HOSPITAL ROOM
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    Room {doctor.room}
                  </p>

                  <button
                    onClick={() => {
                      alert("Doctor profile and appointment booking coming soon!");
                    }}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    View Details →
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <div className="text-5xl mb-4">🩺</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Doctors Found
            </h3>
            <p className="text-slate-500 mt-2">
              Try another name or specialization.
            </p>
          </div>
        )}

      </main>

      {/* Bottom Section */}
      <section className="bg-blue-50 py-10 px-5 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Your Health Deserves the Right Care
        </h2>
        <p className="text-slate-500 mt-2">
          Explore available specialists and find the right healthcare professional.
        </p>
      </section>

    </div>
  );
};

export default Doctor;
