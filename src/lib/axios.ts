import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mquid.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("mymquid-admin-auth");
    const token = stored ? JSON.parse(stored)?.state?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore parse errors
  }
  console.log(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data ?? config.params ?? "");
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`[API ←] ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url}`, res.data);
    return res;
  },
  (err) => {
    console.error(`[API ✗] ${err.response?.status} ${err.config?.method?.toUpperCase()} ${err.config?.url}`, err.response?.data);
    if (err.response?.status === 401) {
      localStorage.removeItem("mymquid-admin-auth");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;
