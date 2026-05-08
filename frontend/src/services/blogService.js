import API from "./api";

// ================= GET ALL BLOGS =================
export const getBlogs = async () => {
  try {
    const res = await API.get("/blogs");

    // BACKEND RETURNS:
    // {
    //   success: true,
    //   data: blogs
    // }

    return res.data;

  } catch (err) {
    console.error("Fetch Blogs Error:", err);

    throw (
      err?.response?.data?.message ||
      "Failed to fetch blogs"
    );
  }
};

// ================= GET SINGLE BLOG =================
export const getBlogById = async (id) => {
  try {
    const res = await API.get(`/blogs/${id}`);

    return res.data;

  } catch (err) {
    console.error("Get Blog Error:", err);

    throw (
      err?.response?.data?.message ||
      "Failed to fetch blog"
    );
  }
};

// ================= CREATE BLOG =================
export const createBlog = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/blogs",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (err) {
    console.error("Create Blog Error:", err);

    throw (
      err?.response?.data?.message ||
      "Failed to create blog"
    );
  }
};

// ================= UPDATE BLOG =================
export const updateBlog = async (
  id,
  data
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.put(
      `/blogs/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (err) {
    console.error("Update Blog Error:", err);

    throw (
      err?.response?.data?.message ||
      "Failed to update blog"
    );
  }
};

// ================= DELETE BLOG =================
export const deleteBlog = async (id) => {
  try {
    const res = await API.delete(
      `/blogs/${id}`
    );

    return res.data;

  } catch (err) {
    console.error("Delete Blog Error:", err);

    throw (
      err?.response?.data?.message ||
      "Failed to delete blog"
    );
  }
};