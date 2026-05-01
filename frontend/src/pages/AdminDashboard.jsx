import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "../services/blogService"; // ✅ include delete API
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load blogs ❌");
    }
  };

  // ✅ Delete blog using backend API
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await deleteBlog(id);

      // Update UI after deletion
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== id)
      );

      alert("Blog deleted successfully ✅");

    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec]">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-light">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Manage all blogs across ThoughtNest ✨
          </p>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">
            No blogs available
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {blogs.map((blog) => (
              <div key={blog._id} className="break-inside-avoid">
                <BlogCard
                  blog={blog}
                  onDelete={handleDelete}  // ✅ delete passed correctly
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;