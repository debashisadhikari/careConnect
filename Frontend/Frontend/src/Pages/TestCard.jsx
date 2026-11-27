
import { useNavigate } from "react-router-dom";

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  const openTest = () => {
    navigate(`/tests/${test._id}`);
  };

  return (
    <div
      onClick={openTest}
      className="group cursor-pointer overflow-hidden rounded-2xl
      border border-gray-200 bg-white transition-all duration-300
      hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
    >
      <div className="p-5">

        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1
            text-xs font-semibold text-blue-700">
            {test.category || "Diagnostic Test"}
          </span>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            test.isAvailable
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}>
            {test.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        <h2 className="mb-3 text-xl font-bold text-gray-900
          transition group-hover:text-blue-600">
          {test.testName}
        </h2>

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <span className="text-lg">🏥</span>
          <span className="font-semibold">
            {test.hospitalName}
          </span>
        </div>

        <p className="mb-5 line-clamp-2 min-h-10 text-sm text-gray-500">
          {test.description || "View test details and booking information."}
        </p>

        <div className="flex items-end justify-between border-t
          border-gray-100 pt-4">

          <div>
            <p className="text-xs text-gray-400">Test price</p>
            <p className="text-2xl font-bold text-blue-700">
              ₹{test.price}
            </p>
          </div>

          <span className="flex items-center gap-2 rounded-lg
            bg-blue-600 px-4 py-2 text-sm font-semibold text-white
            transition group-hover:bg-blue-700">
            View details →
          </span>

        </div>
      </div>
    </div>
  );
};

export default TestCard;
