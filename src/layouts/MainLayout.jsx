 // src/layouts/MainLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function MainLayout() {
    const { usuario, logout, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 rounded hover:bg-blue-700"
                        onClick={toggleMenu}
                    >
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                    <Link to="/dashboard" className="font-bold text-lg">
                        Sistema de Incidencias
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/dashboard" className="hover:underline">
                        Dashboard
                    </Link>
                    <Link to="/nueva-incidencia" className="hover:underline">
                        Nueva Incidencia
                    </Link>
                    {usuario?.role === "admin" && (
                        <>
                            <Link to="/admin/estados" className="hover:underline">
                                Estados
                            </Link>
                            <Link to="/admin/categorias" className="hover:underline">
                                Categorías
                            </Link>
                            <Link to="/admin/faqs" className="hover:underline">
                                FAQs
                            </Link>
                        </>
                    )}
                    {loading ? (
                        <span className="text-sm italic">Cargando...</span>
                    ) : usuario ? (
                        <>
                            <span className="font-medium bg-white/20 px-3 py-1 rounded-full">
                                👤 {usuario.nombre} ({usuario.role})
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <span className="text-sm italic">No autenticado</span>
                    )}
                </div>
            </nav>

            {/* Menú móvil */}
            {menuOpen && (
                <div className="md:hidden bg-blue-500 text-white flex flex-col px-4 py-3 space-y-2">
                    <Link onClick={toggleMenu} to="/dashboard" className="hover:underline">
                        Dashboard
                    </Link>
                    <Link onClick={toggleMenu} to="/nueva-incidencia" className="hover:underline">
                        Nueva Incidencia
                    </Link>
                    {usuario?.role === "admin" && (
                        <>
                            <Link onClick={toggleMenu} to="/admin/estados" className="hover:underline">
                                Estados
                            </Link>
                            <Link onClick={toggleMenu} to="/admin/categorias" className="hover:underline">
                                Categorías
                            </Link>
                        </>
                    )}
                    <div className="border-t border-white/30 mt-2 pt-2 flex flex-col gap-2">
                        {usuario ? (
                            <>
                                <span className="bg-white/20 px-3 py-1 rounded-full">
                                    👤 {usuario.nombre} ({usuario.role})
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        toggleMenu();
                                    }}
                                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <span className="italic">No autenticado</span>
                        )}
                    </div>
                </div>
            )}

            {/* Contenido */}
            <main className="p-6 flex-1">
                <Outlet />
            </main>
        </div>
    );
}
