import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    clearAuth();
    localStorage.removeItem("auth");
    navigate("/");
    window.location.reload(); 
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[9999] bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
          <span className="text-2xl font-semibold text-slate-900">ThoughtNest</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'}>
            Explore
          </Link>

          {/* 🟢 THE NEW TAB */}
          <Link to="/my-stories" className={isActive('/my-stories') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-900 font-medium'}>
            My Stories
          </Link>

          <Link to="/profile" className={isActive('/profile') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'}>
            Profile
          </Link>
          
          <button onClick={handleLogout} className="text-red-500 font-bold text-xs uppercase tracking-widest ml-4 transition-all">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;