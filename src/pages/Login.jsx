// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario) navigate("/dashboard"); // redirige si ya está loqueado
    }, [usuario, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(correo, contraseña);
            navigate("/dashboard");
        } catch (err) {
            if (err.status === 404) {
                setError("📧 Correo no registrado. Por favor, regístrate.");
            } else if (err.status === 401) {
                setError("🔑 Contraseña íncorrecta. Inténtalo de nuevo.");
            } else {
                setError(err?.message || "⚠ Error al iniciar sesión.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
            >
                <h1 className="text-3xl font-bold text-center text-blue-700">🔐 Iniciar Sesión</h1>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correo</label>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
                >
                    Entrar
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
