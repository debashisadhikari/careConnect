
import { useEffect, useState } from "react";
import { useStore } from "../Context/StoreContext";

const initialProfile = {
  name: "",
  registrationNo: "",
  hospitalType: "",
  email: "",
  phone: "",
  alternatePhone: "",
  website: "",
  establishedYear: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  about: "",
  facilities: [],
};

const availableFacilities = [
  "24/7 Emergency",
  "ICU",
  "NICU",
  "Pathology Lab",
  "Digital X-Ray",
  "MRI",
  "CT Scan",
  "Pharmacy",
  "Ambulance",
  "Blood Bank",
  "Operation Theatre",
  "Private Rooms",
  "General Ward",
  "Cafeteria",
];

const HospitalProfile = () => {
  const { manageHospital, getHospital } = useStore();

  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // FETCH HOSPITAL DATA FROM BACKEND
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHospital();

        // Supports either a hospital object or API response wrapper
        const hospital = data?.hospital || data?.data?.hospital || data;

        if (hospital) {
          const updatedProfile = {
            ...initialProfile,
            ...hospital,
            facilities: hospital.facilities || [],
          };

          setProfile(updatedProfile);
          setFormData(updatedProfile);
        }
      } catch (err) {
        console.error("Hospital fetching error:", err);
        setError("Unable to load hospital information.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, []);

  // UPDATE INPUT FIELDS
  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TOGGLE FACILITIES
  const toggleFacility = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  // EDIT PROFILE
  const handleEdit = () => {
    setFormData({
      ...profile,
      facilities: [...profile.facilities],
    });

    setIsEditing(true);
  };

  // CANCEL EDITING
  const handleCancel = () => {
    setFormData({
      ...profile,
      facilities: [...profile.facilities],
    });

    setIsEditing(false);
  };

  // SAVE PROFILE
  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const updatedData = {
        ...formData,
        facilities: [...formData.facilities],
      };

      await manageHospital(updatedData);

      setProfile(updatedData);
      setFormData(updatedData);
      setIsEditing(false);

      alert("Hospital profile updated successfully.");
    } catch (error) {
      console.error("Hospital update error:", error);
      alert("Unable to update hospital profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelStyle =
    "block text-sm font-semibold text-slate-700 mb-2";

  const Detail = ({ label, value }) => (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">
          Loading hospital profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

        <div>
          <p className="text-sm font-semibold text-blue-600 mb-1">
            HOSPITAL MANAGEMENT
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Hospital Profile
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your hospital information and contact details.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleEdit}
            disabled={!!error}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            <span>✎</span>
            Edit Profile
          </button>
        )}

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* HOSPITAL BASIC INFORMATION */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

          {/* BLUE HEADER */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 sm:p-8 text-white">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-4xl">
                🏥
              </div>

              <div className="flex-1">

                <p className="text-xs uppercase tracking-wider text-blue-100 font-semibold">
                  Hospital Information
                </p>

                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  {isEditing ? formData.name : profile.name}
                </h2>

                <p className="text-sm text-blue-100 mt-2">
                  {isEditing
                    ? formData.hospitalType
                    : profile.hospitalType}
                </p>

              </div>

              <div className="sm:text-right">
                <span className="inline-flex px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                  Hospital Admin
                </span>
              </div>

            </div>
          </div>

          {/* BASIC DETAILS */}
          <div className="p-5 sm:p-7">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Basic Information
              </h3>
            </div>

            {isEditing ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Hospital Name *
                  </label>

                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={updateField}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>
                    Registration Number
                  </label>

                  <input
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={updateField}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>
                    Hospital Type
                  </label>

                  <select
                    name="hospitalType"
                    value={formData.hospitalType}
                    onChange={updateField}
                    className={inputStyle}
                  >
                    <option value="">
                      Select Hospital Type
                    </option>

                    <option>
                      Private Multispeciality Hospital
                    </option>

                    <option>Government Hospital</option>
                    <option>Private Hospital</option>
                    <option>Clinic</option>
                    <option>Diagnostic Center</option>
                    <option>Nursing Home</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>
                    Established Year
                  </label>

                  <input
                    type="number"
                    name="establishedYear"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={updateField}
                    className={inputStyle}
                  />
                </div>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <Detail
                  label="Hospital Name"
                  value={profile.name}
                />

                <Detail
                  label="Registration Number"
                  value={profile.registrationNo}
                />

                <Detail
                  label="Hospital Type"
                  value={profile.hospitalType}
                />

                <Detail
                  label="Established Year"
                  value={profile.establishedYear}
                />

              </div>
            )}

          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">

          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Contact Information
          </h3>

          {isEditing ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelStyle}>
                  Email Address *
                </label>

                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Alternate Phone
                </label>

                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Website
                </label>

                <input
                  name="website"
                  value={formData.website}
                  onChange={updateField}
                  placeholder="www.example.com"
                  className={inputStyle}
                />
              </div>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <Detail
                label="Email Address"
                value={profile.email}
              />

              <Detail
                label="Phone Number"
                value={profile.phone}
              />

              <Detail
                label="Alternate Phone"
                value={profile.alternatePhone}
              />

              <Detail
                label="Website"
                value={profile.website}
              />

            </div>
          )}

        </div>

        {/* HOSPITAL ADDRESS */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">

          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Hospital Address
          </h3>

          {isEditing ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelStyle}>
                  Street Address
                </label>

                <input
                  name="address"
                  value={formData.address}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  City
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  State
                </label>

                <input
                  name="state"
                  value={formData.state}
                  onChange={updateField}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>
                  PIN Code
                </label>

                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={updateField}
                  maxLength={6}
                  className={inputStyle}
                />
              </div>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <Detail
                label="Street Address"
                value={profile.address}
              />

              <Detail
                label="City"
                value={profile.city}
              />

              <Detail
                label="State"
                value={profile.state}
              />

              <Detail
                label="PIN Code"
                value={profile.pinCode}
              />

            </div>
          )}

        </div>

        {/* ABOUT HOSPITAL */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">

          <h3 className="text-lg font-bold text-slate-800 mb-5">
            About Hospital
          </h3>

          {isEditing ? (

            <textarea
              name="about"
              rows={5}
              value={formData.about}
              onChange={updateField}
              placeholder="Write about your hospital..."
              className={inputStyle}
            />

          ) : (

            <p className="text-sm text-slate-600 leading-7">
              {profile.about || "No description added yet."}
            </p>

          )}

        </div>

        {/* HOSPITAL FACILITIES */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">

          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Hospital Facilities
          </h3>

          {isEditing ? (

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

              {availableFacilities.map((facility) => (

                <label
                  key={facility}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                    formData.facilities.includes(facility)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >

                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                    className="accent-blue-600"
                  />

                  <span className="text-xs sm:text-sm font-medium">
                    {facility}
                  </span>

                </label>

              ))}

            </div>

          ) : (

            <div className="flex flex-wrap gap-3">

              {profile.facilities.length ? (

                profile.facilities.map((facility) => (

                  <span
                    key={facility}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium"
                  >
                    {facility}
                  </span>

                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No facilities added.
                </p>

              )}

            </div>
          )}

        </div>

        {/* SAVE AND CANCEL BUTTONS */}
        {isEditing && (

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mb-8">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        )}

      </form>

    </div>
  );
};

export default HospitalProfile;
