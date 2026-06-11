import axios from "axios";

// Use proxy in production (Netlify), direct backend in development
const baseURL = 
  import.meta.env.MODE === 'production'
    ? '/api'  // All requests through proxy on Netlify
    : 'https://admin-moderator-backend-staging.up.railway.app/api'; // Direct in dev

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,  // Changed to false for cross-origin requests
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");

      window.location.href =
        "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
