
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyDoctor = {
  doctorName: "",
  specialization: "",
  qualification: "",
  experience: 0,
  registrationNumber: "",
  email: "",
  phone: "",
  room: "",
  consultationFee: 0,
  duration: 30,
  startTime: "",
  endTime: "",
  availableDays: [],
  languages: "",
  about: "",
  status: "Active",
};

const getDoctorId = (doctor) => doctor?._id;

const normalizeDoctors = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.doctors)) return response.doctors;
  if (Array.isArray(response?.data?.doctors)) {
    return response.data.doctors;
  }

  return [];
};

const isSuccessful = (response) => {
  // Supports APIs that return undefined after a successful request.
  if (response === false || response?.success === false) return false;
  if (response?.status >= 400) return false;

  return true;
};

export default function ManageDoctors() {
  const {
    getDoctor,
    editDoctor,
    deleteDoctor,
  } = useStore();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctor();
      const doctorList = normalizeDoctors(response);

      setDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search and filter
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        doctor.doctorName?.toLowerCase().includes(searchText) ||
        doctor.specialization?.toLowerCase().includes(searchText) ||
        doctor.email?.toLowerCase().includes(searchText) ||
        doctor.phone?.toLowerCase().includes(searchText) ||
        doctor.registrationNumber?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || doctor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, search, statusFilter]);

  // Statistics
  const totalDoctors = doctors.length;

  const activeDoctors = doctors.filter(
    (doctor) => doctor.status === "Active"
  ).length;

  const inactiveDoctors = doctors.filter(
    (doctor) => doctor.status === "Inactive"
  ).length;

  // Update edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditingDoctor((previous) => ({
      ...previous,
      [name]:
        name === "experience" ||
        name === "consultationFee" ||
        name === "duration"
          ? Number(value)
          : value,
    }));
  };

  // Update available days
  const handleDayChange = (day) => {
    setEditingDoctor((previous) => {
      const currentDays = previous.availableDays || [];

      const updatedDays = currentDays.includes(day)
        ? currentDays.filter((item) => item !== day)
        : [...currentDays, day];

      return {
        ...previous,
        availableDays: updatedDays,
      };
    });
  };

  // Open edit modal
  const openEditModal = (doctor) => {
    setEditingDoctor({
      ...doctor,
      availableDays: Array.isArray(doctor.availableDays)
        ? [...doctor.availableDays]
        : [],
    });
  };

  // Save doctor
  const saveEdit = async (e) => {
    e.preventDefault();

    if (!editingDoctor?._id) {
      alert("Doctor ID is missing.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Preserve the complete MongoDB document and its original field names.
      const updatedDoctor = {
        ...editingDoctor,
        experience: Number(editingDoctor.experience),
        consultationFee: Number(editingDoctor.consultationFee),
        duration: Number(editingDoctor.duration),
        availableDays: [...(editingDoctor.availableDays || [])],
      };

      const response = await editDoctor(updatedDoctor);

      if (!isSuccessful(response)) {
        throw new Error(
          response?.message || "Failed to update doctor."
        );
      }

      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor._id === updatedDoctor._id ? updatedDoctor : doctor
        )
      );

      if (selectedDoctor?._id === updatedDoctor._id) {
        setSelectedDoctor(updatedDoctor);
      }

      setEditingDoctor(null);
    } catch (err) {
      console.error("Error updating doctor:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update doctor."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle doctor status
  const toggleStatus = async (doctor) => {
    try {
      if (!doctor?._id) return;

      const updatedDoctor = {
        ...doctor,
        status: doctor.status === "Active" ? "Inactive" : "Active",
      };

      const response = await editDoctor(updatedDoctor);

      if (!isSuccessful(response)) {
        throw new Error(
          response?.message || "Failed to update doctor status."
        );
      }

      setDoctors((previous) =>
        previous.map((item) =>
          item._id === doctor._id ? updatedDoctor : item
        )
      );

      if (selectedDoctor?._id === doctor._id) {
        setSelectedDoctor(updatedDoctor);
      }
    } catch (err) {
      console.error("Error changing doctor status:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change doctor status."
      );
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async () => {
    if (!deletingDoctor?._id) return;

    try {
      setDeleting(true);
      setError("");

      const response = await deleteDoctor(deletingDoctor._id);

      if (!isSuccessful(response)) {
        throw new Error(
          response || "Failed to delete doctor."
        );
      }

      setDoctors((previous) =>
        previous.filter(
          (doctor) => doctor._id !== deletingDoctor._id
        )
      );

      if (selectedDoctor?._id === deletingDoctor._id) {
        setSelectedDoctor(null);
      }

      setDeletingDoctor(null);
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete doctor."
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeModals = () => {
    setSelectedDoctor(null);
    setEditingDoctor(null);
    setDeletingDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Manage Doctors
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View, edit and manage your hospital doctors.
            </p>
          </div>

          <Link
            to="/hospital/add-doctor"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
          >
            + Add Doctor
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {totalDoctors}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {activeDoctors}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Inactive Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {inactiveDoctors}
            </h2>
          </div>
        </div>

        {/* Search and filter */}
        <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name, specialization, email..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:w-48"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={fetchDoctors}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* Doctors table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Doctor List
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading doctors...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-medium text-gray-700">
                No doctors found.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Specialization</th>
                    <th className="px-5 py-4">Experience</th>
                    <th className="px-5 py-4">Consultation Fee</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={getDoctorId(doctor)}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {doctor.doctorName || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.email || "No email"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {doctor.specialization || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {doctor.experience ?? 0} years
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        ₹{doctor.consultationFee ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            doctor.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doctor.status || "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            View
                          </button>

                          <button
                            onClick={() => openEditModal(doctor)}
                            className="font-medium text-green-600 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeletingDoctor(doctor)}
                            className="font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Doctor Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-gray-800">
                Doctor Details
              </h2>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              {[
                ["Doctor Name", selectedDoctor.doctorName],
                ["Specialization", selectedDoctor.specialization],
                ["Qualification", selectedDoctor.qualification],
                ["Experience", `${selectedDoctor.experience ?? 0} years`],
                ["Registration Number", selectedDoctor.registrationNumber],
                ["Email", selectedDoctor.email],
                ["Phone", selectedDoctor.phone],
                ["Room", selectedDoctor.room],
                ["Consultation Fee", `₹${selectedDoctor.consultationFee ?? 0}`],
                ["Duration", `${selectedDoctor.duration ?? 0} minutes`],
                ["Start Time", selectedDoctor.startTime],
                ["End Time", selectedDoctor.endTime],
                ["Languages", selectedDoctor.languages],
                ["Status", selectedDoctor.status],
                [
                  "Available Days",
                  selectedDoctor.availableDays?.join(", ") || "Not specified",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words font-medium text-gray-800">
                    {value || "N/A"}
                  </p>
                </div>
              ))}

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase text-gray-400">
                  About
                </p>
                <p className="mt-1 whitespace-pre-wrap text-gray-800">
                  {selectedDoctor.about || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t p-5">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="rounded-lg bg-gray-100 px-5 py-2 font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Doctor
              </h2>

              <button
                onClick={() => setEditingDoctor(null)}
                disabled={saving}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEdit}>
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

                {[
                  {
                    label: "Doctor Name",
                    name: "doctorName",
                    type: "text",
                  },
                  {
                    label: "Specialization",
                    name: "specialization",
                    type: "text",
                  },
                  {
                    label: "Qualification",
                    name: "qualification",
                    type: "text",
                  },
                  {
                    label: "Experience (years)",
                    name: "experience",
                    type: "number",
                  },
                  {
                    label: "Registration Number",
                    name: "registrationNumber",
                    type: "text",
                  },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "text",
                  },
                  {
                    label: "Room",
                    name: "room",
                    type: "text",
                  },
                  {
                    label: "Consultation Fee",
                    name: "consultationFee",
                    type: "number",
                  },
                  {
                    label: "Duration (minutes)",
                    name: "duration",
                    type: "number",
                  },
                  {
                    label: "Start Time",
                    name: "startTime",
                    type: "time",
                  },
                  {
                    label: "End Time",
                    name: "endTime",
                    type: "time",
                  },
                  {
                    label: "Languages",
                    name: "languages",
                    type: "text",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={editingDoctor[field.name] ?? ""}
                      onChange={handleInputChange}
                      min={
                        field.type === "number" ? 0 : undefined
                      }
                      required={
                        field.name === "doctorName" ||
                        field.name === "specialization"
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={editingDoctor.status || "Active"}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Available Days */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Available Days
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {WEEK_DAYS.map((day) => (
                      <label
                        key={day}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={(
                            editingDoctor.availableDays || []
                          ).includes(day)}
                          onChange={() => handleDayChange(day)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                {/* About */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    About Doctor
                  </label>

                  <textarea
                    name="about"
                    rows={4}
                    value={editingDoctor.about || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t p-5">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  disabled={saving}
                  className="rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">
              Delete Doctor
            </h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingDoctor.doctorName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingDoctor(null)}
                disabled={deleting}
                className="rounded-lg bg-gray-100 px-5 py-2 font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteDoctor}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
