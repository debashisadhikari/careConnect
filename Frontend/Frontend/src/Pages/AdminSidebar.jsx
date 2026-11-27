
import { useState } from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Add Test", path: "/admin/dashboard/add-test" },
    { name: "Manage Tests", path: "/admin/dashboard/tests" },
    { name: "Manage Bookings", path: "/admin/dashboard/bookings" },
    { name: "Add Doctor", path: "/admin/dashboard/add-doctor" },
    { name: "Manage Doctors", path: "/admin/dashboard/doctors" },
   
    { name: "Hospital Profile", path: "/admin/dashboard/profile" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {menuOpen ? "✕ Close" : "☰ Menu"}
      </button>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 p-5 flex flex-col transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold text-blue-700">
            CareConnect
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Hospital Admin Panel
          </p>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Management
        </p>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-lg">›</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-400 px-3">
            CareConnect Admin
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
