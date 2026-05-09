import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import MyStories from "./pages/MyStories"; // 🟢 Import the new page
import CreateBlog from "./pages/CreateBlog";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import EditBlog from "./pages/EditBlog";
import BlogDetails from "./pages/BlogDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PROTECTED ROUTES (Require Login) --- */}
        
        {/* Main Dashboard - Explore all blogs */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🟢 My Stories - Dedicated page for user's own blogs only */}
        <Route
          path="/my-stories"
          element={
            <ProtectedRoute>
              <MyStories />
            </ProtectedRoute>
          }
        />

        {/* User Profile - Personal settings/details */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Create a New Story */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />

        {/* Edit an Existing Story */}
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />

        {/* View Specific Story Details */}
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Section */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 - Page Not Found */}
        <Route 
          path="*" 
          element={<div className="p-10 text-center font-serif text-slate-500">Page not found ❌</div>} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;