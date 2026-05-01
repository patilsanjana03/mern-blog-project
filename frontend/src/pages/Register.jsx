import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";


console.log("REGISTER PAGE LOADED 🚀");


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // ✅ prevent page refresh

    console.log("STEP 1: BUTTON CLICKED");

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("All fields required ❌");
      return;
    }

    try {
      console.log("STEP 2: CALLING API...");

      const res = await registerUser({
        name,
        email,
        password,
      });

      console.log("STEP 3: SUCCESS", res);

      alert("Registration successful ✅");
      navigate("/");

    } catch (err) {
      console.log("STEP 4: ERROR", err);
      alert(err || "Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">
      
      <form
        onSubmit={handleRegister}   // ✅ FIX: use form submit
        className="bg-white p-8 rounded-2xl shadow-md w-96 text-center"
      >

        <h2 className="text-3xl font-light mb-2">ThoughtNest</h2>

        <p className="text-gray-500 text-sm mb-6">
          Write something beautiful today
        </p>

        {/* NAME */}
        <input
          className="w-full p-3 border rounded mb-3 outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          className="w-full p-3 border rounded mb-3 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 border rounded mb-4 outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          type="submit"   // ✅ important
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}

export default Register;