export const setAuth = (data) => {
  // ✅ only store user (no token needed)
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};