
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { User, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const roleLinks =
    User?.AccountType === "admin"
      ? [
          { name: "Dashboard", path: "/admin/dashboard" },
          
        ]
      : [
          { name: "Bookings", path: "/bookings" },
         
        ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">C</span>
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            Care<span className="text-blue-600">Connect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/doctors" className={navClass}>
            doctors
          </NavLink>

          {User &&
            roleLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navClass}
              >
                {item.name}
              </NavLink>
            ))}
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {!User ? (
            <>
              <Link
                to="/login"
                className="px-5 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                 className="px-5 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {User.Name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {User.Name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {User.AccountType === "admin"
                      ? "Hospital Admin"
                      : "Patient"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-xl"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-2">

            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              Home
            </NavLink>

           

            {User &&
              roleLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navClass}
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}

            <div className="border-t border-gray-100 mt-3 pt-4 flex flex-col gap-3">
              {!User ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-center py-3 border border-gray-200 rounded-xl font-semibold text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="text-center py-3 bg-blue-600 text-white rounded-xl font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2">
                    <p className="font-bold text-gray-800">
                      {User.Name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {User.AccountType}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
