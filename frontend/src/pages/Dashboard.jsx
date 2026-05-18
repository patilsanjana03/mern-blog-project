import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import BlogCard from "../components/BlogCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // CURRENT LOGGED USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= FETCH BLOGS =================
  const fetchBlogs = async () => {
    try {
      const response = await getBlogs();

      // FIXED: response is now directly the array of blogs, NOT an object with .data
      setBlogs(
        Array.isArray(response)
          ? response
          : []
      );

    } catch (err) {
      console.log("Fetch error:", err);
      setBlogs([]);
    }
  };

  // FETCH ON PAGE LOAD
  useEffect(() => {
    fetchBlogs();
  }, []);

  // ================= FILTER BLOGS =================
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      blog.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  // ================= CATEGORIES =================
  const categories = [
    "All",
    ...new Set(
      blogs.map(
        (blog) => blog.category
      )
    ),
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light">
            Explore Blogs
          </h2>
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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setCategory(cat)
              }
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

        {/* BLOGS GRID */}
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No blogs found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchBlogs}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;