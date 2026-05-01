import API from "./api";

// 🔐 LOGIN
export const loginUser = async (email, password) => {
  try {
    console.log("🔐 LOGIN REQUEST:", { email, password });

    const res = await API.post("/auth/login", {
      email,
      password,
    });

    console.log("✅ LOGIN RESPONSE:", res.data);

    return res.data; // expected: { user: {...} }

  } catch (err) {
    console.log("❌ LOGIN FULL ERROR:", err);
    console.log("❌ LOGIN RESPONSE ERROR:", err?.response?.data);

    throw err?.response?.data?.message || "Login failed ❌";
  }
};


// 📝 REGISTER
export const registerUser = async ({ name, email, password }) => {
  try {
    console.log("📝 REGISTER REQUEST:", { name, email, password });

    const res = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    console.log("✅ REGISTER RESPONSE:", res.data);

    return res.data;

  } catch (err) {
    console.log("❌ REGISTER FULL ERROR:", err);
    console.log("❌ REGISTER RESPONSE ERROR:", err?.response?.data);

    throw err?.response?.data?.message || "Registration failed ❌";
  }
};


// 🚪 LOGOUT
export const logoutUser = async () => {
  try {
    console.log("🚪 LOGOUT REQUEST");

    const res = await API.post("/auth/logout");

    console.log("✅ LOGOUT RESPONSE:", res.data);

    return res.data;

  } catch (err) {
    console.log("❌ LOGOUT ERROR:", err);
    throw err?.response?.data?.message || "Logout failed ❌";
  }
};