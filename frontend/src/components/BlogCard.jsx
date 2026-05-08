import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const BlogCard = ({
  blog,
  fetchBlogs,
  currentUser,
}) => {
  const [comment, setComment] = useState('');

  // ================= LIKE / UNLIKE =================
  const handleLike = async () => {
    try {
      const res = await API.post(
        `/blogs/${blog._id}/like`
      );

      // UPDATE LIKE COUNT IN UI
      blog.likesCount = res.data.likesCount;

      fetchBlogs();

    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // ================= ADD COMMENT =================
  const addComment = async () => {
    try {
      if (!comment.trim()) return;

      await API.post(
        `/blogs/${blog._id}/comment`,
        {
          text: comment,
        }
      );

      setComment('');

      fetchBlogs();

    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  // ================= DELETE BLOG =================
  const deleteBlog = async () => {
    try {
      const confirmDelete = window.confirm(
        'Delete this blog?'
      );

      if (!confirmDelete) return;

      await API.delete(`/blogs/${blog._id}`);

      fetchBlogs();

    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden p-4"
    >

      {/* BLOG IMAGE */}
      {blog.image && (
        <Link to={`/blog/${blog._id}`}>
          <img
            src={blog.image}
            alt="blog"
            className="w-full h-60 object-cover rounded-xl cursor-pointer"
          />
        </Link>
      )}

      {/* BLOG CONTENT */}
      <div className="mt-4">

        {/* TITLE */}
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-2xl font-bold cursor-pointer hover:underline">
            {blog.title}
          </h2>
        </Link>

        {/* CATEGORY */}
        <p className="text-sm text-gray-500 mt-1 uppercase">
          {blog.category}
        </p>

        {/* CONTENT */}
        <p className="text-gray-700 mt-3 line-clamp-4">
          {blog.content}
        </p>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 mt-5">

          {/* LIKE BUTTON */}
          <button
            onClick={handleLike}
            className="bg-pink-100 px-4 py-2 rounded-full hover:bg-pink-200"
          >
            ❤️ Like ({blog.likesCount || 0})
          </button>

          {/* COMMENTS COUNT */}
          <span className="text-gray-600">
            💬 {blog.comments?.length || 0} comments
          </span>
        </div>

        {/* COMMENT INPUT */}
        <div className="mt-5 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className="flex-1 border rounded-lg px-3 py-2 outline-none"
          />

          <button
            onClick={addComment}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Post
          </button>
        </div>

        {/* COMMENTS */}
        <div className="mt-5">
          <h4 className="font-semibold mb-2">
            Comments
          </h4>

          {blog.comments &&
          blog.comments.length > 0 ? (
            blog.comments.map((c, index) => (
              <div
                key={index}
                className="border-b py-2"
              >
                <p className="font-medium">
                  {c.user?.name || 'User'}
                </p>

                <p className="text-gray-700">
                  {c.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No comments yet
            </p>
          )}
        </div>

        {/* OWNER ACTIONS */}
        {currentUser &&
          blog.author &&
          currentUser._id ===
            blog.author._id && (
            <div className="mt-5 flex gap-3">

              {/* EDIT BUTTON */}
              <Link to={`/edit/${blog._id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Edit
                </button>
              </Link>

              {/* DELETE BUTTON */}
              <button
                onClick={deleteBlog}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default BlogCard;