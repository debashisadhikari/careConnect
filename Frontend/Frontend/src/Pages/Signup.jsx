
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    userType: "user",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    // Confirm password validation
    if (formData.password !== formData.confirmpassword) {
      setFieldErrors({
        confirmpassword: "Passwords do not match!",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await signup(formData);

      if (!data?.success) {
        // Backend validation errors
        if (Array.isArray(data?.error)) {
          const errors = {};

          data.error.forEach((item) => {
            errors[item.path] = item.msg;
          });

          setFieldErrors(errors);
        }

        setError(data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-7 sm:p-9">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            🏥
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="text-slate-500 mt-2">
            Join CareConnect and simplify your healthcare journey.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* General Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex gap-2">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 transition ${
                fieldErrors.name
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {fieldErrors.name && (
              <p className="text-red-600 text-xs mt-2">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 transition ${
                fieldErrors.phone
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {fieldErrors.phone && (
              <p className="text-red-600 text-xs mt-2">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 transition ${
                fieldErrors.password
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {fieldErrors.password && (
              <p className="text-red-600 text-xs mt-2">
                {fieldErrors.password}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              Minimum 8 characters with uppercase, lowercase, number and special character.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 transition ${
                fieldErrors.confirmpassword
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
            />

            {fieldErrors.confirmpassword && (
              <p className="text-red-600 text-xs mt-2">
                {fieldErrors.confirmpassword}
              </p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Account Type
            </label>

            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="user">Normal User / Patient</option>
              <option value="admin">Hospital Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-md"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-slate-600 mt-7 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
