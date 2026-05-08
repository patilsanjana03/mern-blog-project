import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogService";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category.toLowerCase());
      formData.append("status", "published");

      // ✅ FIXED FIELD NAME (IMPORTANT)
      images.forEach((img) => {
        formData.append("image", img);
      });

      await createBlog(formData);

      alert("Blog created successfully ✅");

      setTitle("");
      setContent("");
      setCategory("");
      setImages([]);

      navigate("/dashboard");

    } catch (err) {
      console.error("Create blog error:", err);
      alert(err?.response?.data?.message || "Failed to create blog ❌");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-[#f5f2ec] p-10">
        <h1 className="text-3xl font-light mb-6">Create Blog</h1>
        <p className="text-gray-600 text-sm leading-6">
          Share your thoughts, creativity, and ideas with the world.
        </p>
      </div>

      {/* RIGHT FORM */}
      <div className="w-2/3 flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-[500px] space-y-5">

          <h2 className="text-2xl font-light mb-4">Write your blog</h2>

          <input
            className="w-full border-b p-2 outline-none"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border-b p-2 outline-none h-32"
            placeholder="Write your content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            className="w-full border-b p-2 outline-none"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full cursor-pointer"
            onChange={(e) => {
              const files = Array.from(e.target.files);

              if (files.length > 5) {
                alert("Max 5 images allowed");
                return;
              }

              const validFiles = files.filter(
                (file) => file.size <= 2 * 1024 * 1024
              );

              if (validFiles.length !== files.length) {
                alert("Some images exceeded 2MB and were removed");
              }

              setImages(validFiles);
            }}
          />

          {/* PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-24 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

          <button className="bg-black text-white px-6 py-2 mt-4">
            Publish
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateBlog;