import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // New files
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      // ✅ Fetching directly by ID is more efficient than filtering all blogs
      const res = await API.get(`/blogs/${id}`); 
      const blog = res.data;
      setTitle(blog.title);
      setContent(blog.content);
      setCategory(blog.category);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not load the story ❌");
      navigate("/dashboard");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      // ✅ FIXED: Using "image" (singular) to match your Controller/Multer config
      images.forEach((img) => {
        formData.append("image", img);
      });

      // ✅ FIXED: Using "/blogs" route instead of "/posts"
      await API.put(`/blogs/${id}`, formData);

      alert("Story refined successfully ✅");
      navigate(`/blog/${id}`); 
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update story ❌");
    }
  };

  if (loading) return <div className="p-10 text-center font-serif text-slate-400">Opening editor...</div>;

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-serif">
      <Navbar />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* LEFT SIDE: Minimalist Visual Quote */}
        <div className="hidden lg:flex w-2/5 items-center justify-center p-20 border-r border-slate-200">
          <div className="max-w-xs space-y-6">
            <div className="w-12 h-[2px] bg-black"></div>
            <p className="text-3xl font-light italic text-slate-600 leading-relaxed tracking-wide">
              "Editing is the soul of storytelling."
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">
              Refining Draft
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: The Bright Editor */}
        <div className="flex-1 overflow-y-auto bg-white px-8 md:px-20 py-12">
          <form onSubmit={handleUpdate} className="max-w-2xl mx-auto space-y-10">
            
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-600 font-black mb-4">
              <span className="border-b-2 border-black pb-1">Editing Mode</span>
              <span>Entry ID: {id.slice(-6)}</span>
            </div>

            <input
              className="w-full text-5xl font-bold border-none outline-none text-slate-900 leading-tight placeholder:text-slate-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-black text-slate-500">Filed Under</span>
              <input
                className="flex-1 text-base font-medium text-slate-800 outline-none placeholder:text-slate-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
              />
            </div>

            <textarea
              className="w-full min-h-[400px] text-xl leading-relaxed border-none outline-none resize-none text-slate-800 font-sans placeholder:text-slate-200"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
            />

            {/* PREVIEW NEW IMAGES */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    className="h-24 w-24 object-cover rounded-xl border-2 border-slate-100 shadow-md"
                    alt="new-preview"
                  />
                ))}
              </div>
            )}

            <div className="pt-10 flex items-center justify-between border-t-2 border-slate-100">
              <label className="group flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                  <span className="text-2xl">+</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-black">Update Media</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={(e) => setImages(Array.from(e.target.files))} 
                />
              </label>

              <button
                type="submit"
                className="bg-black text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;