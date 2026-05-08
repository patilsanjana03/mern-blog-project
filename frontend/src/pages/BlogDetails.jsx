import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // FETCH SINGLE BLOG
  const fetchBlog = async () => {
    try {
      const res = await API.get(`/blogs/${id}`);

      setBlog(res.data);
    } catch (err) {
      console.error("Fetch blog error:", err);
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  // BLOG NOT FOUND
  if (!blog) {
    return (
      <div className="p-6 text-center text-red-500">
        Blog not found ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ec]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10 bg-white mt-8 rounded-2xl shadow">

        {/* IMAGE */}
        {blog.image && (
          <img
            src={blog.image}
            alt="blog"
            className="w-full max-h-[500px] object-cover rounded-xl mb-6"
          />
        )}

        {/* CATEGORY */}
        <p className="text-sm text-gray-500 uppercase mb-2">
          {blog.category || "General"}
        </p>

        {/* TITLE */}
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* CONTENT */}
        <div className="text-lg text-gray-700 leading-8 whitespace-pre-line">
          {blog.content}
        </div>

        {/* LIKES */}
        <div className="mt-8 text-lg font-semibold">
          ❤️ Likes: {blog.likesCount || 0}
        </div>

        {/* COMMENTS */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Comments
          </h2>

          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => (
              <div
                key={index}
                className="border-b py-3"
              >
                <p className="font-semibold">
                  {comment.user?.name || "User"}
                </p>

                <p className="text-gray-700">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No comments yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;