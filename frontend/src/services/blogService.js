import API from "./api";

// ✅ Get all blogs
export const getBlogs = async () => {
  try {
    const res = await API.get("/posts");
    return res.data;
  } catch (err) {
    console.error("Fetch Blogs Error:", err);
    throw err?.response?.data?.message || "Failed to fetch blogs";
  }
};

// ✅ Create blog (IMPORTANT: FormData support)
export const createBlog = async (data) => {
  const res = await API.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Delete blog
export const deleteBlog = async (id) => {
  try {
    const res = await API.delete(`/posts/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete Blog Error:", err);
    throw err?.response?.data?.message || "Failed to delete blog";
  }
};