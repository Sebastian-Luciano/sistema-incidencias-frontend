// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function Register() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

    const { register, usuario } = useAuth();
    const navigate = useNavigate();

    // 🚫 Redirige si ya está logueado
    useEffect(() => {
        if (usuario) navigate("/dashboard");
    }, [usuario, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setExito("");

        if (!nombre || !correo || !contraseña || !confirmarContraseña) {
            return setError("⚠ Todos los campos son obligatorios.");
        }

        if (contraseña !== confirmarContraseña) {
            return setError("🔑 Las contraseñas no coinciden.");
        }

        try {
            await register(nombre, correo, contraseña);
            setExito("✅ Usuario registrado correctamente. Redirigiendo...");
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            if (err.status === 409) {
                setError("📧 El correo ya está registrado. Inicia sesión.");
            } else {
                setError(err?.message || "❌ Error al registrarte.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
            >
                <h1 className="text-3xl font-bold text-center text-blue-700">
                    📝 Crear Cuenta
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded text-sm text-center">
                        {error}
                    </div>
                )}
                {exito && (
                    <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded text-sm text-center">
                        {exito}
                    </div>
                )}

                {/* Nombre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>
                </div>

                {/* Correo */}
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

                {/* Contraseña */}
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

                {/* Confirmar contraseña */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar contraseña</label>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
                >
                    Registrarme
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
