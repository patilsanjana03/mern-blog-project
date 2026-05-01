import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED: Like using backend API
  const handleLike = async (id) => {
    try {
      await API.post(`/posts/${id}/like`);
      fetchBlogs(); // refresh blogs
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED: Delete using backend API
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await deleteBlog(id);
      fetchBlogs(); // refresh blogs
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 FILTER LOGIC (unchanged)
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || b.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(blogs.map((b) => b.category))
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light">Explore Blogs</h2>

          <Link to="/create">
            <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">
              + Create
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full p-3 mb-4 rounded border outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1 rounded-full border ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        {filteredBlogs.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No blogs found
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="break-inside-avoid">
                <BlogCard
                  blog={blog}
                  onLike={handleLike}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;