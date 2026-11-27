
import { useState } from "react";
import { useStore } from "../Context/StoreContext";
import { useNavigate } from "react-router-dom";


const AddTest = () => {
  const {addTestController}=useStore();
  const navigate=useNavigate();

    const initialFormData = {
        testName: "",
        category: "",
        description: "",
        price: "",
        discountPrice: "",
        duration: "",
        startTime: "",
        endTime: "",
        availableDays: []
    };

    const [formData, setFormData] = useState(initialFormData);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDayChange = (day) => {
        setFormData((prev) => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter((d) => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        

        if (Number(formData.price) <= 0) {
            alert("Please enter a valid test price.");
            return;
        }

        if (
            formData.discountPrice !== "" &&
            (
                Number(formData.discountPrice) < 0 ||
                Number(formData.discountPrice) > Number(formData.price)
            )
        ) {
            alert("Discount price cannot be greater than regular price.");
            return;
        }

        if (formData.endTime <= formData.startTime) {
            alert("Closing time must be later than opening time.");
            return;
        }

        if (formData.availableDays.length === 0) {
            alert("Please select at least one available day.");
            return;
        }

        console.log("Test Details:", formData);
       const result= await addTestController(formData);
       console.log(result);
       if(result.success!=true){
        alert("test not added try again!");
       }else{
        alert("Successully added!");
       }

        
    };

    const inputStyle =
        "w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-white text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-500";

    const labelStyle =
        "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="w-full min-w-0 max-w-[1300px] mx-auto px-2 sm:px-4 lg:px-6 text-[14px] sm:text-[15px] lg:text-[16px]">

            {/* Page Heading */}
            <div className="mb-8 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Add Diagnostic Test
                </h2>

                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Add a new diagnostic test with pricing and availability details.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">

                {/* Test Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 xl:p-10">

                    <div className="mb-7">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                01
                            </div>

                            <div>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                                    Test Information
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Enter the basic details of your diagnostic test.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">

                        {/* Test Name */}
                        <div>
                            <label className={labelStyle}>
                                Test Name *
                            </label>

                            <input
                                type="text"
                                name="testName"
                                value={formData.testName}
                                onChange={handleChange}
                                placeholder="e.g. Complete Blood Count (CBC)"
                                required
                                className={inputStyle}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className={labelStyle}>
                                Test Category *
                            </label>

                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            >
                                
                            </input>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className={labelStyle}>
                                Test Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describe the test and its purpose..."
                                className={`${inputStyle} resize-none`}
                            />
                        </div>

                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 xl:p-10">

                    <div className="mb-7">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                                02
                            </div>

                            <div>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                                    Test Pricing
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Set the price patients will pay for this test.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">

                        {/* Regular Price */}
                        <div>
                            <label className={labelStyle}>
                                Regular Price (₹) *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 800"
                                required
                                className={inputStyle}
                            />
                        </div>

                        {/* Discount Price */}
                        <div>
                            <label className={labelStyle}>
                                Discount Price (₹)
                            </label>

                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                min="0"
                                placeholder="e.g. 650"
                                className={inputStyle}
                            />
                        </div>

                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                        Leave discount price empty if no discount is available.
                    </p>
                </div>

                {/* Availability and Time */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 xl:p-10">

                    <div className="mb-7">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                03
                            </div>

                            <div>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                                    Availability & Timing
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Configure test duration and operating hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">

                        {/* Duration */}
                        <div>
                            <label className={labelStyle}>
                                Test Duration *
                            </label>

                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 30"
                                required
                                className={inputStyle}
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Duration in minutes
                            </p>
                        </div>

                        {/* Opening Time */}
                        <div>
                            <label className={labelStyle}>
                                Opening Time *
                            </label>

                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />
                        </div>

                        {/* Closing Time */}
                        <div>
                            <label className={labelStyle}>
                                Closing Time *
                            </label>

                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className={inputStyle}
                            />
                        </div>

                    </div>

                    {/* Available Days */}
                    <div className="mt-8 pt-7 border-t border-gray-100">

                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Available Days *
                        </label>

                        <div className="flex flex-wrap gap-3">

                            {days.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayChange(day)}
                                    aria-pressed={formData.availableDays.includes(day)}
                                    className={`px-5 py-3 rounded-xl border text-sm font-semibold transition duration-200 ${
                                        formData.availableDays.includes(day)
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                                    }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}

                        </div>

                        {formData.availableDays.length === 0 && (
                            <p className="text-xs text-gray-400 mt-3">
                                Select at least one available day.
                            </p>
                        )}

                    </div>

                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pb-6">

                    <button
                        type="button"
                        onClick={() => setFormData(initialFormData)}
                        className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                    >
                        Reset Form
                    </button>

                    <button
                        type="submit"
                        disabled={formData.availableDays.length === 0}
                        className="px-9 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100 transition"
                    >
                        + Add Diagnostic Test
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddTest;
