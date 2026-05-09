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

// Inside BlogCard.jsx - replace the return statement UI:
return (
  <div className="glass-card hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
    {/* Image Container */}
    <div className="relative overflow-hidden aspect-[16/10]">
      {blog.image && (
        <Link to={`/blog/${blog._id}`}>
          <img
            src={`http://localhost:5000${blog.image}`} 
            alt="blog"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-700 shadow-sm">
          {blog.category}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <Link to={`/blog/${blog._id}`}>
        <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug hover:text-slate-700 transition-colors">
          {blog.title}
        </h2>
      </Link>

      <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
        {blog.content}
      </p>

      {/* Interaction Bar */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-slate-600 hover:text-pink-500 transition-colors">
            <span className="text-lg">❤️</span>
            <span className="text-sm font-medium">{blog.likesCount || 0}</span>
          </button>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-lg">💬</span>
            <span className="text-sm font-medium">{blog.comments?.length || 0}</span>
          </div>
        </div>

        {/* Owner Controls */}
        {currentUser?._id === blog.author?._id && (
          <div className="flex gap-2">
            <Link to={`/edit/${blog._id}`} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-500">
              ✏️
            </Link>
            <button onClick={deleteBlog} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default BlogCard;