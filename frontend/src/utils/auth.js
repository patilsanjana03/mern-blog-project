// src/utils/auth.js

export const setAuth = (data) => {
  // Store the user object securely in local storage
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  try {
    const data = localStorage.getItem("auth");
    // If data exists, parse it; otherwise return null
    return data ? JSON.parse(data) : null;
  } catch (error) {
    // If the data in localStorage is corrupted, clear it and return null
    console.error("Auth parsing error:", error);
    localStorage.removeItem("auth");
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
  // It's good practice to clear everything to prevent session bleeding
  localStorage.clear(); 
};