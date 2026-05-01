import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService"; // ✅ API logout
import { clearAuth } from "../utils/auth"; // ✅ clear local data

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); // 🔥 call backend to clear cookie
      clearAuth();       // 🔥 remove user from localStorage

      navigate("/");

    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed ❌");
    }
  };

  return (
    <div className="bg-[#f5f2ec] border-b border-gray-300 shadow-sm px-6 py-4">

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">

        {/* App Name */}
        <h1 className="text-xl font-semibold">ThoughtNest</h1>

        {/* Links */}
        <div className="flex gap-6 text-gray-700">

          <Link to="/dashboard" className="hover:underline">
            Home
          </Link>

          <Link to="/profile" className="hover:underline">
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="hover:underline text-red-500"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Navbar;