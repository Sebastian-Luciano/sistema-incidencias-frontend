// src/services/httpClient.js
import { getToken } from "./authService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/** helpers */
const buildUrl = (path) => `${API_BASE}${path}`;

const buildQuery = (params = {}) => {
  const keys = Object.keys(params).filter((k) => params[k] !== undefined && params[k] !== "");
  if (keys.length === 0) return "";
  return (
    "?" +
    keys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join("&")
  );
};

const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = payload?.mensaje || payload?.message || res.statusText || "Error en petición";
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
};

export const http = {
  get: async (path, params = {}) => {
    const token = getToken();
    const url = buildUrl(path) + buildQuery(params);
    const res = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return handleResponse(res);
  },

  post: async (path, body = {}) => {
    const token = getToken();
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (path, body = {}) => {
    const token = getToken();
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  del: async (path) => {
    const token = getToken();
    const res = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return handleResponse(res);
  },
};
