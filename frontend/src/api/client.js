import axios from "axios";
import { loadAuth, clearAuth } from "../auth/storage.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const a = loadAuth();
  if (a?.token) {
    config.headers.Authorization = `Bearer ${a.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes("/auth/login")) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  return `${base}${path}`;
}
