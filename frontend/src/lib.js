export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export function getToken() {
  return localStorage.getItem("storySphereToken");
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("storySphereUser") || "null");
  } catch {
    return null;
  }
}

export function getUserId(user = getCurrentUser()) {
  return user?._id || user?.id || user?.userId || "";
}

export function imageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${SERVER_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await response.text();
  let result;
  try { result = text ? JSON.parse(text) : {}; } catch { result = { message: text }; }
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
}

export function initials(name = "User") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
}

export function formatRelativeDate(value) {
  if (!value) return "";
  const date = new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
