import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService"; // ✅ API import

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // ✅ Fetch from backend instead of localStorage
  const fetchBlog = async () => {
    try {
      const blogs = await getBlogs();
      const found = blogs.find((b) => b._id === id);
      setBlog(found || null);
    } catch (err) {
      console.error("Fetch blog error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  // ❌ Not found
  if (!blog) {
    return (
      <div className="p-6 text-center text-red-500">
        Blog not found ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ec] p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* IMAGE */}
        {blog.image && (
          <img
            src={blog.image}
            alt="blog"
            className="w-full h-60 object-cover rounded mb-4"
          />
        )}

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2">
          {blog.title || "Untitled"}
        </h1>

        {/* CATEGORY */}
        <p className="text-sm text-gray-500 mb-4">
          {blog.category?.toUpperCase() || "GENERAL"}
        </p>

        {/* CONTENT */}
        <p className="text-gray-700 whitespace-pre-line leading-7">
          {blog.content || "No content available"}
        </p>

      </div>
    </div>
  );
}

export default BlogDetails;