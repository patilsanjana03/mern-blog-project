import { useState } from "react";
import { loginUser } from "../services/authService";
import { setAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent reload

    console.log("STEP 1: LOGIN CLICKED");

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      console.log("STEP 2: CALLING LOGIN API...");

      const res = await loginUser(email, password);

      console.log("STEP 3: LOGIN RESPONSE:", res);

      // ✅ Save user (backend does not send token)
      setAuth(res);

      alert("Login successful ✅");

      if (res?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.log("STEP 4: LOGIN ERROR:", err);
      alert(err || "Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
      
      <form
        onSubmit={handleLogin}   // ✅ use form submit
        className="bg-white p-8 rounded-2xl shadow-md w-96 text-center"
      >

        <h2 className="text-3xl font-light mb-2">ThoughtNest</h2>

        <p className="text-gray-500 text-sm mb-6">
          Where your thoughts feel at home
        </p>

        {/* EMAIL */}
        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 border rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          type="submit"   // ✅ important
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>

        {/* REGISTER */}
        <p className="text-sm mt-4">
          New here?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Create an account
          </span>
        </p>

      </form>
    </div>
  );
}

export default Login;