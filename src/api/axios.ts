import axios from "axios";

// Always use backend directly
const baseURL = 'https://admin-moderator-backend-staging.up.railway.app/api';

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
