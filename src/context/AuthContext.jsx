// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const token = authService.getToken();
        const stored = authService.getUser();

        if (!token) {
          setUsuario(null);
          setLoading(false);
          return;
        }

        try {
          // ✅ Solo valida token, no sobreescribe perfil
          await authService.me(token);
          if (stored) setUsuario(stored);
        } catch (err) {
          console.warn("⚠ Token inválido, cerrando sesión");
          authService.removeToken();
          setUsuario(null);
        }
      } catch (err) {
        console.error("Auth init error", err);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (correo, contraseña) => {
    try {
      const res = await authService.login(correo, contraseña);
      const token = res.token;
      const perfil = res.perfil;

      if (!token) throw new Error("No se recibió token");

      authService.saveToken(token);
      if (perfil) authService.saveUser(perfil);

      setUsuario(perfil);
      return perfil;
    } catch (err) {
      console.error("Error en login:", err);
      throw err;
    }
  };

  const logout = () => {
    authService.removeToken();
    setUsuario(null);
    navigate("/login");
  };

  const register = async (nombre, correo, contraseña) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contraseña }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.mensaje || "Error en el registro");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setUsuario(data.usuario);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
