// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Endpoints that should NOT trigger auto-logout handling
const AUTH_WHITELIST = ["/auth/login", "/auth/refresh"];

// Prevent multiple redirects when many calls fail together
let logoutInProgress = false;

function logoutAndRedirect() {
  if (logoutInProgress) return;
  logoutInProgress = true;

  // Clear stored token
  localStorage.removeItem("token");

  // Optional: clear other app state
  // localStorage.removeItem("user");

  // Redirect to login page
  window.location.href = "/login?reason=session-expired";
}

// Request interceptor: attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto logout on 401/403
API.interceptors.response.use(
  (response) => response,
  
  (error) => {
    console.error("API error:", error);
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    // If backend returns 401/403 for expired/invalid JWT
    if ((status === 401 || status === 403) && !AUTH_WHITELIST.some((p) => requestUrl.includes(p))) {
      logoutAndRedirect();
    }

    return Promise.reject(error);
  }
);

export default API;