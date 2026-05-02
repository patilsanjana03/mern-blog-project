import { useState } from "react";
import { getAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // ✅ for comment API

function BlogCard({ blog, onLike, onDelete }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(blog.comments || []);
  const { user } = getAuth();
  const navigate = useNavigate();

  // ✅ Add comment via API
  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await API.post(`/posts/${blog._id}/comment`, {
        text: comment,
      });

      // update UI with new comments
      setComments(res.data.comments || []);
      setComment("");

    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to add comment ❌");
    }
  };

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
    >

      {/* IMAGE */}
      {blog.images?.length > 0 && (
        <img
          src={blog.images[0]} // ✅ first image
          alt="blog"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      {/* TITLE */}
      <h3 className="text-xl font-bold">{blog.title}</h3>

      {/* CONTENT */}
      <p className="text-gray-600 whitespace-pre-line">
        {blog.content}
      </p>

      {/* CATEGORY */}
      <p className="text-sm mt-1">
        <b>Category:</b> {blog.category?.toUpperCase()}
      </p>

      {/* LIKE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLike(blog._id);
        }}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        👍 {blog.likes || 0}
      </button>

      {/* USER: edit + delete */}
      {user?.email === blog.author && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${blog._id}`);
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!window.confirm("Delete this blog?")) return;
              onDelete(blog._id);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* ADMIN DELETE */}
      {user?.role === "admin" && user?.email !== blog.author && (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!window.confirm("Delete this blog?")) return;
              onDelete(blog._id);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* COMMENTS */}
      <div className="mt-3">
        <input
          value={comment}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add comment"
          className="border p-2 w-full rounded"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            addComment();
          }}
          className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
        >
          Post
        </button>
      </div>

      {/* COMMENT LIST */}
      <div className="mt-2 space-y-1">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">No comments yet</p>
        ) : (
          comments.map((c) => (
  <p key={c._id || c.text} className="text-sm bg-gray-100 p-2 rounded">
              💬 {typeof c === "string" ? c : c.text}
            </p>
          ))
        )}
      </div>

    </div>
  );
}

export default BlogCard;