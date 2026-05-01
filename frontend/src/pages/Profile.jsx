import Navbar from "../components/Navbar";
import { getAuth } from "../utils/auth";

function Profile() {
  const auth = getAuth();
  const user = auth?.user || null; // ✅ safe fallback

  // ❗ If user not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl text-gray-600">
          Please login to view profile
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ec]">

      {/* Navbar */}
      <Navbar />

      {/* Profile Container */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-light">Your Profile</h2>
          <p className="text-gray-500 text-sm">
            Where your thoughts feel at home
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md mx-auto text-center">

          {/* Avatar */}
          <div className="w-20 h-20 mx-auto mb-4 bg-black text-white flex items-center justify-center rounded-full text-2xl font-bold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold mb-2">
            {user.name || "Unknown User"}
          </h3>

          {/* Email */}
          <p className="text-gray-600 mb-2">
            {user.email || "No Email"}
          </p>

          {/* Role Badge */}
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              user.role === "admin"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {user.role?.toUpperCase() || "USER"}
          </span>

        </div>
      </div>
    </div>
  );
}

export default Profile;