
import { useState } from "react";
import { useStore } from "../Context/StoreContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const AddDoctor = () => {
    const navigate=useNavigate();
    const {User}=useAuth();
   


    const { addDoctor } = useStore();

    const initialData = {
        doctorName: "",
        specialization: "",
        qualification: "",
        experience: "",
        registrationNumber: "",
        email: "",
        phone: "",
        room: "",
        consultationFee: "",
        duration: "30",
        startTime: "",
        endTime: "",
        availableDays: [],
        languages: "",
        about: "",
        status: "Active",
        profileImage: null
    };

    const [formData, setFormData] = useState(initialData);

    const days = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    ];

    const inputStyle =
        "w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition";

    const labelStyle =
        "block text-sm font-semibold text-gray-700 mb-2";

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle available days
    const handleDayChange = (day) => {
        setFormData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    // Handle image
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
        }
    };

    // Submit doctor data
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.endTime <= formData.startTime) {
            alert("Closing time must be later than opening time.");
            return;
        }

        if (formData.availableDays.length === 0) {
            alert("Please select available days.");
            return;
        }

        const doctorData = {
            ...formData,
            experience: Number(formData.experience),
            consultationFee: Number(formData.consultationFee),
            duration: Number(formData.duration)
        };

        await addDoctor(doctorData);

        setFormData(initialData);
    };

    return (
        <div className="w-full min-w-0 max-w-[1300px] mx-auto px-2 sm:px-4 lg:px-6 text-[14px] sm:text-[15px] lg:text-[16px]">

            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Add New Doctor
                </h2>

                <p className="text-gray-500 mt-2">
                    Add doctor details, consultation fees and availability.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">

                {/* Doctor Information */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">

                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            01
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Doctor Information
                            </h3>
                            <p className="text-sm text-gray-500">
                                Basic professional information
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className={labelStyle}>Doctor Name *</label>
                            <input name="doctorName" value={formData.doctorName} onChange={handleChange} placeholder="Enter doctor's full name" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Specialization *</label>
                            <select name="specialization" value={formData.specialization} onChange={handleChange} required className={inputStyle}>
                                <option value="">Select Specialization</option>
                                <option>Cardiologist</option>
                                <option>Neurologist</option>
                                <option>Dermatologist</option>
                                <option>Orthopedic</option>
                                <option>General Physician</option>
                                <option>Pediatrician</option>
                                <option>Gynecologist</option>
                                <option>ENT Specialist</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelStyle}>Qualification *</label>
                            <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Experience (Years) *</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" placeholder="e.g. 8" required className={inputStyle} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelStyle}>Medical Registration Number *</label>
                            <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Enter medical registration number" required className={inputStyle} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelStyle}>Doctor Profile Photo</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className={`${inputStyle} file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700`} />
                            <p className="text-xs text-gray-400 mt-2">
                                Upload a professional profile image.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Contact Information */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">

                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                            02
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Contact Information
                            </h3>
                            <p className="text-sm text-gray-500">
                                Doctor's contact and consultation room details
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className={labelStyle}>Email Address *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Consultation Room</label>
                            <input name="room" value={formData.room} onChange={handleChange} placeholder="e.g. Room 204" className={inputStyle} />
                        </div>

                    </div>
                </section>

                {/* Consultation Details */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">

                    <div className="flex items-center gap-3 mb-7">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            03
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Consultation & Availability
                            </h3>
                            <p className="text-sm text-gray-500">
                                Set consultation charges and working hours
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        <div>
                            <label className={labelStyle}>Consultation Fee (₹) *</label>
                            <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} min="0" placeholder="e.g. 500" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Consultation Duration (Minutes) *</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Account Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelStyle}>Opening Time *</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Closing Time *</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>Languages Spoken</label>
                            <input name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g. English, Bengali, Hindi" className={inputStyle} />
                        </div>

                    </div>

                    {/* Available Days */}
                    <div className="mt-8 pt-7 border-t border-gray-100">
                        <label className={labelStyle}>Available Days *</label>

                        <div className="flex flex-wrap gap-3">
                            {days.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayChange(day)}
                                    className={`px-5 py-3 rounded-xl border text-sm font-semibold transition ${
                                        formData.availableDays.includes(day)
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                                    }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* About Doctor */}
                    <div className="mt-8">
                        <label className={labelStyle}>About Doctor</label>
                        <textarea name="about" value={formData.about} onChange={handleChange} rows="4" placeholder="Write a short professional introduction..." className={`${inputStyle} resize-none`} />
                    </div>

                </section>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pb-6">

                    <button
                        type="button"
                        onClick={() => setFormData(initialData)}
                        className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                    >
                        Reset Form
                    </button>

                    <button
                        type="submit"
                        className="px-9 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                    >
                        + Add Doctor
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AddDoctor;
