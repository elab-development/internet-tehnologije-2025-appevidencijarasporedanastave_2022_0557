import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUserRole } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Student App
      </Link>

      <div className="flex items-center gap-6">
        {isLoggedIn && (
          <>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>

            {role === "STUDENT" && (
              <Link to="/schedule" className="hover:underline">
                My Schedule
              </Link>
            )}

            {role === "PROFESSOR" && (
              <>
                <Link to="/schedule-professor" className="hover:underline">
                  My Schedule
                </Link>
                <Link to="/chart-professor" className="hover:underline">
                  Attendance Stats
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/schedule-admin" className="hover:underline">
                  Schedule
                </Link>
                <Link to="/users" className="hover:underline">
                  Users
                </Link>
              </>
            )}
          </>
        )}

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="bg-white text-indigo-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;