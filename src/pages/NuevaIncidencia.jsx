// src/pages/NuevaIncidencia.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearIncidencia } from "../services/incidenciaService";
import { obtenerCategorias } from "../services/categoriaService";
import { FiAlertCircle, FiFileText, FiTag } from "react-icons/fi";

export default function NuevaIncidencia() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await obtenerCategorias();
                setCategorias(Array.isArray(data) ? data : data?.data ?? []);
            } catch (err) {
                console.error("Error cargando categorías:", err);
                setError("❌ No se pudieron cargar las categorías.");
            }
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setExito("");

        if (!titulo || !descripcion || !categoriaId) {
            setError("⚠ Todos los campos son obligatorios.");
            return;
        }

        try {
            await crearIncidencia({
                titulo,
                descripcion,
                estado_id: 1,
                categoria_id: Number(categoriaId),
            });

            setExito("✅ Incidencia registrada correctamente.");
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (err) {
            console.error(err);
            setError("❌ Error al registrar la incidencia.");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 mt-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-blue-600" /> Nueva Incidencia
            </h1>
            <p className="text-gray-600 mb-6 text-sm">
                Completa el formulario para registrar un nuevo problema en el sistema.
            </p>

            {error && (
                <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                    <FiAlertCircle /> {error}
                </div>
            )}
            {exito && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                    {exito}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Ej: Problema con la red WiFi"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                        <FiFileText className="text-gray-600" /> Descripción
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows="4"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Describe el problema en detalle"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                        <FiTag className="text-gray-600" /> Categoría
                    </label>
                    <select
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">-- Selecciona una categoría --</option>
                        {categorias.map((cat) => (
                            <option key={cat.id_categoria ?? cat.id} value={cat.id_categoria ?? cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                >
                    Registrar incidencia
                </button>
            </form>
        </div>
    );
}
