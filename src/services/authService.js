// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// 🔹 token / usuario en localStorage
export const saveToken = (token) => localStorage.setItem("token", token);
export const saveUser = (perfil) => localStorage.setItem("usuario", JSON.stringify(perfil));
export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    // si JSON inválido, limpiamos
    localStorage.removeItem("usuario");
    return null;
  }
};
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// LOGIN -> POST /api/auth/login
export const login = async (correo, contraseña) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.mensaje || payload?.message || "Error al iniciar sesión";
    throw new Error(msg);
  }

  // backend retorna { token, perfil, ... } según tu controller
  return payload;
};

// REGISTER -> POST /api/auth/register
export const register = async (usuarioData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioData),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.mensaje || payload?.message || "Error al registrar usuario";
    throw new Error(msg);
  }
  return payload;
};

// obtener info /me (requiere token)
export const me = async (token) => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.mensaje || payload?.message || "No autorizado");
  return payload;
};

export const logout = () => removeToken();
