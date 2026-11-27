
import React, { useState, useEffect } from "react";
import { useStore } from "../Context/StoreContext";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ManageTests = () => {
  const { editTest, getTest,deleteTest } = useStore();

  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingTest, setEditingTest] = useState(null);
  const [deletingTest, setDeletingTest] = useState(null);

  // Get all tests
  const getAllTest = async () => {
    const Test = await getTest();
    setTests(Test || []);
  };

  useEffect(() => {
    getAllTest();
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(tests.map((test) => test.category)),
  ];

  // Filter tests
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testName.toLowerCase().includes(search.toLowerCase()) ||
      test.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Update test
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedTest = {
      _id: editingTest._id,
      testName: editingTest.testName,
      hospitalName: editingTest.hospitalName,
      category: editingTest.category,
      duration: editingTest.duration,
      price: e.target.price.value,
      startTime: e.target.startTime.value,
      endTime: e.target.endTime.value,
      availableDays: editingTest.availableDays,
    };

    await editTest(updatedTest);

    setTests((prevTests) =>
      prevTests.map((test) =>
        test._id === editingTest._id ? updatedTest : test
      )
    );

    setEditingTest(null);
  };

  // Handle available days
  const handleDayChange = (day) => {
    setEditingTest((prev) => {
      const alreadySelected = prev.availableDays.includes(day);

      return {
        ...prev,
        availableDays: alreadySelected
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  // Delete test (currently removes from local state only)
  const handleDelete = async() => {
   ;
    setTests((prevTests) =>
      prevTests.filter((test) => test._id !== deletingTest._id)
    );
     const result=await deleteTest(deletingTest._id);
    console.log(result);

    setDeletingTest(null);
  };

  const totalTests = tests.length;

  const availableTests = tests.filter(
    (test) => test.availableDays.length > 0
  ).length;

  const totalCategories = new Set(
    tests.map((test) => test.category)
  ).size;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Tests
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View, update and manage your hospital test services.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Tests</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {totalTests}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Available Tests</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {availableTests}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {totalCategories}
          </h2>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">

        <input
          type="text"
          placeholder="Search test name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:w-56"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      {/* Tests Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold text-gray-800">
            All Tests
          </h2>

          <span className="text-sm text-gray-500">
            {filteredTests.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Test Details</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Duration</th>
                <th className="px-5 py-4 font-semibold">Availability</th>
                <th className="px-5 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50">

                    {/* Test Details */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {test.testName}
                      </p>

                      <p className="mt-1 max-w-xs text-xs text-gray-500">
                        {test.hospitalName}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {test.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        ₹{test.price}
                      </p>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-gray-600">
                      {test.duration} minutes
                    </td>

                    {/* Availability */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">
                        {test.startTime} - {test.endTime}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {test.availableDays.length} days/week
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            setEditingTest({
                              ...test,
                              availableDays: [...test.availableDays],
                            })
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeletingTest(test)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No tests found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Test
              </h2>

              <button
                onClick={() => setEditingTest(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate}>

              {/* Read-only details */}
              <div className="mb-5 rounded-lg bg-gray-50 p-4">

                <p className="mb-2 text-xs font-medium uppercase text-gray-400">
                  Test Information (Read Only)
                </p>

                <div className="space-y-2">

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Test Name:</span>{" "}
                    {editingTest.testName}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Hospital Name:</span>{" "}
                    {editingTest.hospitalName}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {editingTest.category}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Duration:</span>{" "}
                    {editingTest.duration} minutes
                  </p>

                </div>
              </div>

              {/* Editable Price */}
              <div className="mb-4">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Test Price (₹)
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  required
                  value={editingTest.price}
                  onChange={(e) =>
                    setEditingTest({
                      ...editingTest,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                />

              </div>

              {/* Editable Timing */}
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opening Time
                  </label>

                  <input
                    name="startTime"
                    type="time"
                    required
                    value={editingTest.startTime}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Closing Time
                  </label>

                  <input
                    name="endTime"
                    type="time"
                    required
                    value={editingTest.endTime}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* Available Days */}
              <div className="mb-6">

                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Available Days
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {weekdays.map((day) => (
                    <label
                      key={day}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={editingTest.availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="h-4 w-4 accent-blue-600"
                      />

                      <span className="text-gray-700">{day}</span>
                    </label>
                  ))}

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t pt-4">

                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
              !
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Delete Test?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingTest.testName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setDeletingTest(null)}
                className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTests;
