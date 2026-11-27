
import { useMemo, useState, useEffect } from "react";
import { useStore } from "../Context/StoreContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const {User}=useAuth();
  const navigate=useNavigate();
  const { getAllTests, postBook } = useStore();

  const [tests, setTests] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showHospital, setShowHospital] = useState(false);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");

  const [bookingMessage, setBookingMessage] = useState({
    type: "",
    text: "",
  });

  // Get today's date in local YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Fetch tests and hospital information
  useEffect(() => {
    const getAllTest = async () => {
      try {
        setLoading(true);

        const result = await getAllTests();

        setTests(
          Array.isArray(result?.test) ? result.test : []
        );

        setHospital(
          Array.isArray(result?.hospital)
            ? result.hospital[0] || null
            : result?.hospital || null
        );
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllTest();
  }, [getAllTests]);

  const categories = [
    "All",
    ...new Set(tests.map((test) => test.category).filter(Boolean)),
  ];

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        test.testName?.toLowerCase().includes(searchText) ||
        test.hospitalName?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || test.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [tests, search, category]);

  // Check whether a particular date is available
  const isDateAvailable = (test, dateString) => {
    if (!test || !dateString || !Array.isArray(test.availableDays)) {
      return false;
    }

    const selectedDate = new Date(`${dateString}T12:00:00`);

    const selectedDay = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(selectedDate);

    return test.availableDays.includes(selectedDay);
  };

  const currentSelectedTest = selectedTest
    ? tests.find((test) => test._id === selectedTest._id) || selectedTest
    : null;

  // Open test details
  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setShowHospital(false);
    setAppointmentDate("");
    setBookingMessage({ type: "", text: "" });
  };

  // Book selected test
  const handleBookTest = async () => {
    if (!currentSelectedTest || booking) return;

    if (!appointmentDate) {
      setBookingMessage({
        type: "error",
        text: "Please select your appointment date.",
      });
      return;
    }

    if (appointmentDate < getTodayDate()) {
      setBookingMessage({
        type: "error",
        text: "Please select today or a future date.",
      });
      return;
    }

    if (!isDateAvailable(currentSelectedTest, appointmentDate)) {
      setBookingMessage({
        type: "error",
        text: "The selected date is not available for this test. Please choose another date.",
      });
      return;
    }

    const hospitalId =
      currentSelectedTest.HospitalId ||
      currentSelectedTest.hospitalId ||
      hospital?._id;

    const testId = currentSelectedTest._id;

    if (!hospitalId || !testId) {
      setBookingMessage({
        type: "error",
        text: "Hospital ID or Test ID is missing.",
      });
      return;
    }

    try {
      setBooking(true);
      setBookingMessage({ type: "", text: "" });

      const bookingData = {
        ...currentSelectedTest,
        HospitalId: hospitalId,
        TestId: testId,
        appointmentDate,
      };

      const response = await postBook(bookingData);

      if (response?.success === false) {
        throw new Error(response.message || "Booking failed.");
      }

      setBookingMessage({
        type: "success",
        text: "Your test booking request was submitted successfully!",
      });

      setAppointmentDate("");
    } catch (error) {
      console.error("Booking error:", error);

      setBookingMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to book test. Please try again.",
      });
    } finally {
      setBooking(false);
    }
  };

  // Hospital information page
  if (showHospital && hospital) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => setShowHospital(false)}
            className="mb-6 font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Test Details
          </button>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                CareConnect Hospital Profile
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                {hospital.name}
              </h1>

              <p className="mt-3 text-blue-100">
                🏥 {hospital.hospitalType}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Hospital Address"
                  value={`${hospital.address || ""}, ${hospital.city || ""}, ${hospital.state || ""} - ${hospital.pinCode || ""}`}
                />

                <InfoCard
                  title="Established Year"
                  value={hospital.establishedYear}
                />

                <InfoCard
                  title="Phone Number"
                  value={hospital.phone}
                />

                <InfoCard
                  title="Alternate Phone"
                  value={hospital.alternatePhone}
                />

                <InfoCard
                  title="Email Address"
                  value={hospital.email}
                />

                <InfoCard
                  title="Website"
                  value={hospital.website}
                />

                <InfoCard
                  title="Registration Number"
                  value={hospital.registrationNo}
                />

                <InfoCard
                  title="Hospital Type"
                  value={hospital.hospitalType}
                />
              </div>

              <div className="mt-8">
                <h2 className="mb-3 text-xl font-bold text-gray-900">
                  About Hospital
                </h2>

                <p className="leading-7 text-gray-600">
                  {hospital.about || "No hospital description available."}
                </p>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Hospital Facilities
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {hospital.facilities?.map((facility, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700"
                    >
                      ✓ {facility}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-blue-50 p-5">
                <h3 className="font-bold text-blue-900">
                  Location
                </h3>

                <p className="mt-2 text-sm text-blue-800">
                  {hospital.address}, {hospital.city}, {hospital.state},
                  India - {hospital.pinCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">
            CareConnect Diagnostics
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Find the right test at the right price.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
            Compare diagnostic test prices from different hospitals.
            Find the right healthcare service for your needs.
          </p>

          <div className="mt-8 max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search test name or hospital..."
              className="w-full rounded-xl border border-white/30 bg-white px-5 py-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-blue-300"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* Categories */}
        <div className="mb-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Explore Diagnostic Tests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare prices and choose a hospital.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item);
                  setSelectedTest(null);
                  setAppointmentDate("");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Test Cards */}
        {!currentSelectedTest && (
          <>
            <p className="mb-5 text-sm text-gray-500">
              Showing {filteredTests.length} test(s)
            </p>

            {loading ? (
              <div className="rounded-2xl border bg-white py-20 text-center text-gray-500">
                Loading tests...
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="rounded-2xl border bg-white py-20 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  No tests found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching with another test or hospital name.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    onClick={() => handleSelectTest(test)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                  >
                    <div className="p-5">
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {test.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isDateAvailable(test, getTodayDate())
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isDateAvailable(test, getTodayDate())
                            ? "Available Today"
                            : "Not Available Today"}
                        </span>
                      </div>

                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition group-hover:text-blue-600">
                        {test.testName}
                      </h3>

                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                        <span>🏥</span>
                        <span className="font-semibold">
                          {test.hospitalName}
                        </span>
                      </div>

                      <div className="mb-4 flex items-start gap-2 text-sm text-gray-500">
                        <span>📍</span>
                        <span>
                          {hospital
                            ? `${hospital.address}, ${hospital.city}`
                            : "Hospital address unavailable"}
                        </span>
                      </div>

                      <p className="mb-5 line-clamp-2 min-h-10 text-sm text-gray-500">
                        {test.description ||
                          "Diagnostic test service provided by the hospital."}
                      </p>

                      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Test price
                          </p>

                          <p className="text-2xl font-bold text-blue-700">
                            ₹{test.price}
                          </p>
                        </div>

                        <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Selected Test Details */}
        {currentSelectedTest && (
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => {
                setSelectedTest(null);
                setAppointmentDate("");
                setBookingMessage({ type: "", text: "" });
              }}
              className="mb-6 font-semibold text-blue-600 hover:text-blue-800"
            >
              ← Back to all tests
            </button>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {currentSelectedTest.category}
                </span>

                <h1 className="mt-5 text-3xl font-bold">
                  {currentSelectedTest.testName}
                </h1>

                <p className="mt-3 text-blue-100">
                  🏥 {currentSelectedTest.hospitalName}
                </p>

                {hospital && (
                  <p className="mt-2 text-sm text-blue-100">
                    📍 {hospital.address}, {hospital.city}, {hospital.state}
                  </p>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-blue-50 p-5">
                    <p className="text-sm text-gray-500">
                      Test price
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-700">
                      ₹{currentSelectedTest.price}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-500">
                      Available Days
                    </p>

                    <p className="mt-2 text-sm font-bold text-gray-800">
                      {currentSelectedTest.availableDays?.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                {/* About Test */}
                <div className="mt-8">
                  <h2 className="mb-3 text-xl font-bold text-gray-900">
                    About this test
                  </h2>

                  <p className="leading-7 text-gray-600">
                    {currentSelectedTest.description ||
                      "Diagnostic test service provided by the hospital."}
                  </p>
                </div>

                {/* Test Information */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Test information
                  </h2>

                  <div className="space-y-4 text-sm">
                    <DetailRow
                      label="Duration"
                      value={`${currentSelectedTest.duration ?? "Not specified"} minutes`}
                    />

                    <DetailRow
                      label="Opening Time"
                      value={currentSelectedTest.startTime}
                    />

                    <DetailRow
                      label="Closing Time"
                      value={currentSelectedTest.endTime}
                    />

                    <DetailRow
                      label="Available Days"
                      value={currentSelectedTest.availableDays?.join(", ")}
                    />
                  </div>
                </div>

                {/* Hospital Information */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Hospital information
                  </h2>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="font-bold text-gray-900">
                      {hospital?.name || currentSelectedTest.hospitalName}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      📍{" "}
                      {hospital
                        ? `${hospital.address}, ${hospital.city}, ${hospital.state} - ${hospital.pinCode}`
                        : "Address unavailable"}
                    </p>

                    {hospital?.phone && (
                      <p className="mt-2 text-sm text-gray-600">
                        📞 {hospital.phone}
                      </p>
                    )}

                    <button
                      onClick={() => setShowHospital(true)}
                      disabled={!hospital}
                      className="mt-5 rounded-lg border border-blue-600 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      View Hospital →
                    </button>
                  </div>
                </div>

                {/* Appointment Date Selection */}
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    Select Appointment Date
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    Choose the date you want to visit the hospital for this test.
                  </p>

                  <div className="mt-5">
                    <label
                      htmlFor="appointmentDate"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Your Visit Date
                    </label>

                    <input
                      id="appointmentDate"
                      type="date"
                      min={getTodayDate()}
                      value={appointmentDate}
                      onChange={(e) => {
                        setAppointmentDate(e.target.value);
                        setBookingMessage({ type: "", text: "" });
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:max-w-sm"
                    />
                  </div>

                  {appointmentDate && (
                    <div className="mt-4">
                      {isDateAvailable(
                        currentSelectedTest,
                        appointmentDate
                      ) ? (
                        <p className="text-sm font-semibold text-green-700">
                          ✓ This test is available on your selected date.
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-red-600">
                          ✕ This test is not available on that day. Please select another date.
                        </p>
                      )}
                    </div>
                  )}

                  {currentSelectedTest.availableDays?.length > 0 && (
                    <p className="mt-4 text-xs text-gray-500">
                      Available days:{" "}
                      {currentSelectedTest.availableDays.join(", ")}
                    </p>
                  )}
                </div>

                {/* Booking Feedback */}
                {bookingMessage.text && (
                  <div
                    className={`mt-5 rounded-lg p-4 text-sm font-medium ${
                      bookingMessage.type === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {bookingMessage.text}
                  </div>
                )}

               {User?(
                <button
                  disabled={
                    booking ||
                    !appointmentDate ||
                    !isDateAvailable(
                      currentSelectedTest,
                      appointmentDate
                    )
                  }
                  onClick={handleBookTest}
                  className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {booking ? "Booking..." : "Book This Test"}
                </button>
               ):(

               <button className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"onClick={()=>{
                Navigate("/login");
               }}>
                login
               </button>
               )}
                
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Reusable components
const InfoCard = ({ title, value }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-xs font-medium text-gray-500">
      {title}
    </p>

    <p className="mt-2 break-words font-semibold text-gray-800">
      {value || "Not available"}
    </p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500">{label}</span>

    <span className="text-right font-semibold text-gray-800">
      {value || "Not available"}
    </span>
  </div>
);

export default TestPage;
