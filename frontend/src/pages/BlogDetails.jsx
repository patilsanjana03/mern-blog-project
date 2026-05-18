import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const SERVER_URL = "http://localhost:5000";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  // Get current user safely from localStorage
  const auth = localStorage.getItem("auth");
  const currentUser = auth ? JSON.parse(auth).user : null;

  useEffect(() => {
    fetchBlog();
  }, [id]);

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/blogs/${id}/comment`, { text: commentText });
      setBlog({ ...blog, comments: res.data }); 
      setCommentText(""); 
    } catch (err) {
      alert("Failed to add comment.");
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("Login to like this story ❤️");
      return;
    }
    try {
      const res = await API.post(`/blogs/${id}/like`);
      // Update both likes array and likesCount from server response
      setBlog({ 
        ...blog, 
        likes: res.data.likes, 
        likesCount: res.data.likesCount 
      });
    } catch (err) {
      alert("Error processing like.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      alert("Deleted successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting blog.");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400 font-serif">Loading story...</div>;
  if (!blog) return <div className="p-10 text-center text-red-500 font-serif">Blog not found ❌</div>;

  const blogAuthorId = blog.author?._id || blog.author;
  const loggedInUserId = currentUser?._id || currentUser?.id;
  const isOwner = loggedInUserId && blogAuthorId && String(loggedInUserId) === String(blogAuthorId);

  // Check if current user has already liked this specific blog
  const hasLiked = blog.likes && loggedInUserId && blog.likes.includes(String(loggedInUserId));

  return (
    <div className="min-h-screen bg-[#f5f2ec] font-serif">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10 bg-white mt-8 rounded-2xl shadow-sm mb-20">
        
        {/* ACTION BUTTONS */}
        {isOwner && (
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={() => navigate(`/edit/${blog._id}`)} 
              className="text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
            >
              Edit Story
            </button>
            <button 
              onClick={handleDelete} 
              className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-50 px-5 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all border border-red-100"
            >
              Delete
            </button>
          </div>
        )}

        {/* IMAGE */}
        {blog.image && (
          <img
            src={blog.image.startsWith('http') ? blog.image : `${SERVER_URL}${blog.image}`}
            alt="blog"
            className="w-full max-h-[550px] object-cover rounded-xl mb-10 shadow-sm"
          />
        )}

        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-4">
            {blog.category || "General"}
          </p>

          <h1 className="text-5xl font-bold mb-8 leading-tight text-slate-900">
            {blog.title}
          </h1>

          <div className="text-xl text-slate-700 leading-relaxed whitespace-pre-line border-l-4 border-slate-200 pl-8 mb-12 font-sans">
            {blog.content}
          </div>

          {/* LIKE BUTTON SECTION */}
          <div className="py-8 border-t border-b border-slate-100 flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 border px-8 py-3 rounded-full transition-all font-sans font-bold text-sm ${
                hasLiked 
                  ? "bg-pink-100 text-pink-600 border-pink-300" 
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              <span className="text-base">{hasLiked ? "❤️" : "🤍"}</span> 
              <span>{blog.likesCount || 0} Likes</span>
            </button>
          </div>

          {/* DISCUSSION */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-10 text-slate-900">Discussion</h2>

            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-14">
                <textarea
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-black transition-all h-32 resize-none mb-4 text-slate-800 font-sans placeholder:text-slate-400"
                  placeholder="Share a thoughtful response..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button className="bg-black text-white px-12 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 p-8 rounded-3xl text-center mb-12 border border-dashed border-slate-300">
                <p className="text-slate-600 font-bold italic font-sans">Please sign in to join the conversation.</p>
              </div>
            )}

            <div className="space-y-10">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment, index) => (
                  <div key={index} className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-sm uppercase border border-white">
                      {comment.user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100">
                        <p className="font-black text-xs uppercase tracking-widest text-slate-800 mb-2">
                          {comment.user?.name || "Anonymous Reader"}
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed font-sans">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-center py-10">No comments yet. Start the discussion!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BlogDetails;