import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogs } from "../services/blogService";
import API from "../services/api";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [images, setImages] = useState([]);        // ✅ new images
  const [existingImages, setExistingImages] = useState([]); // ✅ old images

  // ✅ Load blog from backend
  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blogs = await getBlogs();
      const blog = blogs.find((b) => b._id === id);

      if (blog) {
        setTitle(blog.title);
        setContent(blog.content);
        setCategory(blog.category);
        setExistingImages(blog.images || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ Update blog via API
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      // add new images
      images.forEach((img) => {
        formData.append("images", img);
      });

      await API.put(`/posts/${id}`, formData);

      alert("Blog updated successfully ✅");
      navigate("/dashboard");

    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update blog ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec] flex items-center justify-center">

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >

        <h2 className="text-2xl font-light text-center mb-2">
          Edit Blog ✨
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Refine your thoughts beautifully
        </p>

        {/* Title */}
        <input
          className="w-full border rounded p-3 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        {/* Content */}
        <textarea
          className="w-full border rounded p-3 mb-3 h-28"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />

        {/* Category */}
        <select
          className="w-full border rounded p-3 mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Lifestyle</option>
          <option>Travel</option>
          <option>Design</option>
          <option>Food</option>
        </select>

        {/* NEW IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full mb-3"
          onChange={(e) => {
            const files = Array.from(e.target.files);

            if (files.length > 5) {
              alert("Max 5 images allowed");
              return;
            }

            setImages(files);
          }}
        />

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {existingImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* NEW IMAGE PREVIEW */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Button */}
        <button className="w-full bg-black text-white p-3 rounded">
          Update Blog
        </button>

      </form>
    </div>
  );
}

export default EditBlog;