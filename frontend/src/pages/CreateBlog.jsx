import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogService";
import Navbar from "../components/Navbar";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return alert("Max 5 images allowed");
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    setImages(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category.toLowerCase());
      formData.append("status", "published");

      // ✅ Match backend expectation: key is "image"
      images.forEach((img) => {
        formData.append("image", img); 
      });

      await createBlog(formData);
      alert("Story published successfully ✅");
      
      // ✅ Redirect to My Stories to see the new entry in the personal grid
      navigate("/my-stories"); 
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to publish story ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-serif">
      <Navbar />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* LEFT SIDE: Minimalist Space */}
        <div className="hidden lg:flex w-2/5 items-center justify-center p-20 border-r border-slate-200">
          <div className="max-w-xs space-y-6">
            <div className="w-12 h-[2px] bg-black"></div>
            <p className="text-3xl font-light italic text-slate-600 leading-relaxed tracking-wide">
              "Great stories happen to those who can tell them."
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">
              ThoughtNest Editor v2.0
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Editor Area */}
        <div className="flex-1 overflow-y-auto bg-white px-8 md:px-20 py-12">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
            
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-600 font-bold mb-4">
              <span className="border-b-2 border-black pb-1">New Entry</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <input
              className="w-full text-5xl font-bold border-none outline-none placeholder:text-slate-300 text-slate-900 leading-tight"
              placeholder="Title of your story"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />

            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <span className="text-xs uppercase font-black text-slate-500 tracking-tighter">Filed Under</span>
              <input
                className="flex-1 text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Technology, Personal, Life..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <textarea
              className="w-full min-h-[400px] text-xl leading-relaxed border-none outline-none resize-none placeholder:text-slate-300 text-slate-800 font-sans"
              placeholder="Begin your narrative..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded-lg border-2 border-slate-100 shadow-md"
                  />
                ))}
              </div>
            )}

            <div className="pt-10 flex items-center justify-between border-t-2 border-slate-100">
              <label className="group flex items-center gap-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="text-2xl">+</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-black">Add Media</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl active:scale-95 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isSubmitting ? "Publishing..." : "Publish Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;