import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyStories() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    try {
      setLoading(true);
      // 🔥 We hit the specific personal endpoint
      const res = await API.get("/blogs/my-stories");
      
      // Since the backend filters for us, we just set the data
      setMyBlogs(res.data);
    } catch (err) {
      console.error("Error loading My Stories:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-serif">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">My Stories</h1>
          <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {myBlogs.length} Entries
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 italic">Accessing your library...</div>
        ) : myBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBlogs.map((blog) => (
              <div 
                key={blog._id} 
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="group cursor-pointer bg-white border border-slate-100 p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 inline-block">
                    {blog.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-4 line-clamp-3 font-sans leading-relaxed">
                    {blog.content}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-sans">❤️ {blog.likesCount || 0}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 group-hover:underline">
                    Open Entry →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-6 font-sans">You haven't written any stories yet.</p>
            <button 
              onClick={() => navigate("/create")}
              className="bg-black text-white px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
            >
              Start Writing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyStories;