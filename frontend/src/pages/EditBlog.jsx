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
  const [selectedFile, setSelectedFile] = useState(null); // Single file for Cloudinary
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category);
        // Set initial preview if image exists
        setPreview(res.data.image);
        setLoading(false);
      } catch (err) {
        navigate("/dashboard");
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // Show new image preview
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    
    if (selectedFile) {
      formData.append("image", selectedFile); // Singular "image" matches backend
    }

    try {
      await API.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Refined successfully! ✅");
      navigate(`/blog/${id}`);
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  if (loading) return <div className="p-10 text-center font-serif text-slate-400">Opening editor...</div>;

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-serif">
      <Navbar />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* LEFT SIDE: Visual Design */}
        <div className="hidden lg:flex w-2/5 items-center justify-center p-20 border-r border-slate-200">
          <div className="max-w-xs space-y-6">
            <div className="w-12 h-[2px] bg-black"></div>
            <p className="text-3xl font-light italic text-slate-600 leading-relaxed">
              "Editing is the soul of storytelling."
            </p>
            {preview && (
              <img src={preview.startsWith('http') ? preview : `http://localhost:5000/${preview.replace(/\\/g, '/')}`} 
                   className="w-full h-40 object-cover rounded-2xl shadow-xl mt-10" alt="Preview" />
            )}
          </div>
        </div>

        {/* RIGHT SIDE: The Editor */}
        <div className="flex-1 overflow-y-auto bg-white px-8 md:px-20 py-12">
          <form onSubmit={handleUpdate} className="max-w-2xl mx-auto space-y-10">
            <input
              className="w-full text-5xl font-bold border-none outline-none text-slate-900 placeholder:text-slate-200"
              value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
            />

            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-black text-slate-400">Category</span>
              <input className="flex-1 text-base outline-none" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <textarea
              className="w-full min-h-[400px] text-xl leading-relaxed border-none outline-none resize-none"
              value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing..."
            />

            <div className="pt-10 flex items-center justify-between border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <span className="text-xl">+</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Update Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>

              <button type="submit" className="bg-black text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-2xl">
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