// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {
    obtenerMisIncidencias,
    obtenerIncidenciasAdmin,
    obtenerIncidencia,
    actualizarIncidencia,
    eliminarIncidencia,
} from "../services/incidenciaService";
import { crearHistorial, obtenerHistorialPorIncidencia } from "../services/historialService";
import { http } from "../services/httpClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "../components/ChatBot";
import { FiClipboard, FiTrash2, FiEdit2, FiPlus, FiX } from "react-icons/fi";

export default function Dashboard() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [incidencias, setIncidencias] = useState([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // filtros
    const [q, setQ] = useState("");
    const [estadoId, setEstadoId] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    // catálogos
    const [estados, setEstados] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // modales / selección
    const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [incSeleccionada, setIncSeleccionada] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [mensaje, setMensaje] = useState(null);

    // modales / historial
    const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
    const [historial, setHistorial] = useState([]);

    // formatea Date -> 'YYYY-MM-DD HH:mm:ss' (hora LOCAL)
    const formatDateTimeForSQL = (date) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // parsea 'YYYY-MM-DD HH:mm:ss' (o si viene ISO con T/Z, lo maneja también)
    // Devuelve un objeto Date correcto (interpreta 'YYYY-MM-DD HH:mm:ss' como hora LOCAL)
    const parseSqlDateTimeToLocal = (sql) => {
        if (!sql) return null;
        // Si ya parece ISO (tiene 'T' or 'Z'), dejar que Date lo parsee
        if (sql.includes("T") || sql.endsWith("Z")) {
            return new Date(sql);
        }
        // 'YYYY-MM-DD HH:mm:ss' -> construimos Date local explícitamente
        const [datePart, timePart = "00:00:00"] = sql.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);
        return new Date(y, m - 1, d, hh, mm, ss);
    };


    // --- Cargar estados y categorías dinámicamente ---
    useEffect(() => {
        (async () => {
            try {
                const resEst = await http.get("/estados");
                const resCat = await http.get("/categorias");
                const estArr = Array.isArray(resEst) ? resEst : resEst?.data ?? [];
                const catArr = Array.isArray(resCat) ? resCat : resCat?.data ?? [];
                setEstados(estArr);
                setCategorias(catArr);
            } catch (err) {
                console.error("Error cargando estados/categorías:", err);
            }
        })();
    }, []);

    // --- Cargar incidencias ---
    const cargar = async (page = 1) => {
        if (!usuario) return;
        setLoading(true);
        setError("");
        try {
            const params = { page, limit: meta.limit };
            if (q?.trim()) params.q = q.trim();
            if (estadoId) params.estado_id = estadoId;
            if (categoriaId) params.categoria_id = categoriaId;

            let res;
            if (usuario?.role === "admin") {
                res = await obtenerIncidenciasAdmin(params);
            } else {
                res = await obtenerMisIncidencias(params);
            }

            // normalizar respuesta
            let items = [];
            let metaResp = { ...meta, page };

            if (!res) {
                items = [];
            } else if (Array.isArray(res)) {
                items = res;
            } else if (res.data && Array.isArray(res.data)) {
                items = res.data;
                metaResp = { ...metaResp, ...(res.meta || {}) };
            } else if (res.rows && Array.isArray(res.rows)) {
                items = res.rows;
                metaResp = { page: Number(res.page || page), limit: Number(res.limit || meta.limit), total: res.total ?? 0 };
                metaResp.totalPages = Math.ceil((metaResp.total || 0) / (metaResp.limit || 10));
            } else {
                items = [];
            }

            setIncidencias(items);
            setMeta((m) => ({ ...m, ...metaResp }));
        } catch (err) {
            console.error("Error cargando incidencias:", err);
            setError(err?.message || "Error al cargar incidencias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!usuario) return;
        cargar(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario, q, estadoId, categoriaId]);

    // --- Render estado visual ---
    const renderEstado = (estado) => {
        const base = "px-2 py-1 rounded text-xs font-semibold";
        switch (estado) {
            case "Pendiente":
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>{estado}</span>;
            case "En proceso":
                return <span className={`${base} bg-blue-100 text-blue-800`}>{estado}</span>;
            case "Resuelto":
                return <span className={`${base} bg-green-100 text-green-800`}>{estado}</span>;
            case "Cancelado":
                return <span className={`${base} bg-red-100 text-red-800`}>{estado}</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-800`}>{estado}</span>;
        }
    };

    // --- Abrir modal cambiar estado ---
    const abrirModalEstado = (inc) => {
        setIncSeleccionada(inc);
        setNuevoEstado(inc.estado_id ?? "");
        setModalEstadoOpen(true);
    };

    const cerrarModalEstado = () => {
        setModalEstadoOpen(false);
        setIncSeleccionada(null);
        setNuevoEstado("");
    };

    // Confirmar cambio de estado de incidencia
    const confirmarCambioEstado = async () => {
        if (!incSeleccionada) return setMensaje({ type: "error", text: "No hay incidencia seleccionada." });

        try {
            // Obtener incidencia actual del backend (para no confiar en la UI)
            const incidenciaActual = await obtenerIncidencia(incSeleccionada.id_incidencia);

            // determinar adminId real (puede venir en el objeto usuario guardado en localStorage o en token)
            const adminId = usuario?.id ?? usuario?.sub ?? null;

            // Construir payload (completo)
            const payload = {
                titulo: incidenciaActual.titulo,
                descripcion: incidenciaActual.descripcion,
                estado_id: Number(nuevoEstado),
                categoria_id: incidenciaActual.categoria_id,
                usuario_id: incidenciaActual.usuario_id,
                // Preferimos que el backend también valide/forze esto, pero lo mandamos correcto desde frontend
                ...(adminId ? { administrador_id: adminId } : {}),
            };

            // Actualizar incidencia (PUT)
            await actualizarIncidencia(incSeleccionada.id_incidencia, payload);

            // Registrar en historial (ruta /historiales)
            await crearHistorial({
                fecha_cambio: formatDateTimeForSQL(new Date()), // <-- local 'YYYY-MM-DD HH:mm:ss'
                descripcion: `Cambio de estado: ${incidenciaActual.estado_id} → ${payload.estado_id}`,
                estado_anterior_id: incidenciaActual.estado_id,
                estado_nuevo_id: payload.estado_id,
                incidencia_id: incSeleccionada.id_incidencia,
                realizado_por_id: adminId ?? 2, // si no hay adminId (no debería), usar fallback (pero backend también debe validar)
            });

            // feedback
            try { toast?.success?.("✅ Estado actualizado correctamente"); } catch (e) { setMensaje({ type: "success", text: "✅ Estado actualizado correctamente" }); }

            cerrarModalEstado();
            cargar(meta.page);
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            const msg = (error?.message) || "No se pudo actualizar el estado";
            try { toast?.error?.(`❌ ${msg}`); } catch (e) { setMensaje({ type: "error", text: `❌ ${msg}` }); }
        }
    };

    // --- Delete flow ---
    const abrirModalDelete = (inc) => {
        setIncSeleccionada(inc);
        setModalDeleteOpen(true);
    };

    const cerrarModalDelete = () => {
        setModalDeleteOpen(false);
        setIncSeleccionada(null);
    };

    const confirmarEliminar = async () => {
        if (!incSeleccionada) return;
        try {
            await eliminarIncidencia(incSeleccionada.id_incidencia);
            setMensaje({ type: "success", text: "✅ Incidencia eliminada correctamente" });
            cerrarModalDelete();
            const newPage = meta.page > 1 && incidencias.length === 1 ? meta.page - 1 : meta.page;
            cargar(newPage);
        } catch (err) {
            console.error("Error eliminando incidencia:", err);
            setMensaje({ type: "error", text: err?.message || "No se pudo eliminar la incidencia" });
        }
    };

    // --- Abrir modal historial ---
    const abrirModalHistorial = async (incidencia) => {
        console.log("📡 Solicitando historial de incidencia", incidencia.id_incidencia);
        try {
            const data = await obtenerHistorialPorIncidencia(incidencia.id_incidencia);
            setHistorial(data);
            setModalHistorialOpen(true);
        } catch (error) {
            toast.error("Error al cargar historial");
        }
    };

    const cerrarModalHistorial = () => {
        setModalHistorialOpen(false);
        setHistorial([]);
    };


    // limpiar mensaje después de un tiempo
    useEffect(() => {
        if (!mensaje) return;
        const t = setTimeout(() => setMensaje(null), 4500);
        return () => clearTimeout(t);
    }, [mensaje]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FiClipboard className="text-blue-600" />
                        {usuario?.role === "admin" ? "Todas las incidencias" : "Mis Incidencias"}
                    </h1>
                    <p className="text-gray-600">
                        {usuario?.role === "admin"
                            ? "Gestión completa de incidencias del sistema."
                            : "Aquí puedes ver y dar seguimiento a todas tus incidencias registradas."}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/nueva-incidencia")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow flex items-center gap-2"
                    >
                        <FiPlus /> Nueva Incidencia
                    </button>
                </div>
            </div>

            {/* mensajes */}
            {mensaje && (
                <div
                    className={`mb-4 p-3 rounded text-sm ${mensaje.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {mensaje.text}
                </div>
            )}

            {/* filtros */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por título o descripción"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="border rounded px-3 py-2 flex-1 text-sm"
                />

                <select value={estadoId} onChange={(e) => setEstadoId(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="">Todos los estados</option>
                    {estados.map((est) => (
                        <option key={est.id_estado} value={est.id_estado}>
                            {est.nombre}
                        </option>
                    ))}
                </select>

                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* tabla */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="text-left px-4 py-3 border">Título</th>
                            <th className="text-left px-4 py-3 border">Descripción</th>
                            <th className="text-left px-4 py-3 border">Categoría</th>
                            <th className="text-left px-4 py-3 border">Estado</th>
                            <th className="text-left px-4 py-3 border">Fecha</th>
                            {usuario?.role === "admin" && <th className="text-center px-4 py-3 border">Usuario</th>}
                            {usuario?.role === "admin" && <th className="text-center px-4 py-3 border">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={usuario?.role === "admin" ? 7 : 5} className="text-center py-6 text-gray-500">
                                    Cargando...
                                </td>
                            </tr>
                        ) : incidencias.length > 0 ? (
                            incidencias.map((inc) => (
                                <tr key={inc.id_incidencia ?? inc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 border font-medium text-gray-800">{inc.titulo}</td>
                                    <td className="px-4 py-3 border text-gray-600">{inc.descripcion}</td>
                                    <td className="px-4 py-3 border">{inc.categoria_nombre ?? "-"}</td>
                                    <td className="px-4 py-3 border">{renderEstado(inc.estado_nombre)}</td>
                                    <td className="px-4 py-3 border text-gray-500 text-xs">
                                        {inc.fecha_registro ? new Date(inc.fecha_registro).toLocaleDateString() : "-"}
                                    </td>
                                    {usuario?.role === "admin" && <td className="px-4 py-3 border">{inc.usuario_nombre ?? "-"}</td>}
                                    {usuario?.role === "admin" && (
                                        <td className="px-4 py-3 border flex gap-2">
                                            <button
                                                title="Cambiar estado"
                                                onClick={() => abrirModalEstado(inc)}
                                                className="px-2 py-1 border rounded hover:bg-gray-100 flex items-center gap-1"
                                            >
                                                <FiEdit2 />
                                                Cambiar
                                            </button>
                                            <button
                                                title="Eliminar"
                                                onClick={() => abrirModalDelete(inc)}
                                                className="px-2 py-1 border rounded hover:bg-gray-100 flex items-center gap-1 text-red-600"
                                            >
                                                <FiTrash2 />
                                                Eliminar
                                            </button>
                                            <button
                                                onClick={() => abrirModalHistorial(inc)}
                                                className="px-2 py-1 rounded border hover:bg-gray-200 text-gray-700"
                                            >
                                                🕑 Historial
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={usuario?.role === "admin" ? 7 : 5} className="text-center py-6 text-gray-500">
                                    No hay incidencias registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* paginación */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>
                    Página {meta.page} de {meta.totalPages} (total {meta.total})
                </span>
                <div className="flex gap-2">
                    <button disabled={meta.page <= 1} onClick={() => cargar(meta.page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">
                        ◀ Anterior
                    </button>
                    <button
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => cargar(meta.page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Siguiente ▶
                    </button>
                </div>
            </div>

            {/* Modal: cambiar estado */}
            {modalEstadoOpen && incSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Cambiar estado</h3>
                            <button onClick={cerrarModalEstado} className="p-1 rounded hover:bg-gray-100">
                                <FiX />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            Incidencia: <span className="font-semibold">{incSeleccionada.titulo}</span>
                        </p>

                        <label className="block text-sm mb-2">Estado</label>
                        <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)} className="w-full border rounded px-3 py-2 mb-4">
                            <option value="">-- Selecciona estado --</option>
                            {estados.map((s) => (
                                <option key={s.id_estado} value={s.id_estado}>
                                    {s.nombre}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button onClick={cerrarModalEstado} className="px-3 py-2 border rounded">
                                Cancelar
                            </button>
                            <button onClick={confirmarCambioEstado} className="px-3 py-2 bg-blue-600 text-white rounded">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: eliminar confirm */}
            {modalDeleteOpen && incSeleccionada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">¿Eliminar incidencia?</h3>
                        <p className="text-sm text-gray-600 mb-4">Confirma que deseas eliminar la incidencia <b>{incSeleccionada.titulo}</b>. Esta acción no se puede deshacer.</p>

                        <div className="flex justify-end gap-2">
                            <button onClick={cerrarModalDelete} className="px-3 py-2 border rounded">
                                Cancelar
                            </button>
                            <button onClick={confirmarEliminar} className="px-3 py-2 bg-red-600 text-white rounded">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: historial */}
            {modalHistorialOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4">Historial de cambios</h3>
                        <div className="max-h-64 overflow-y-auto">
                            {historial.length > 0 ? (
                                historial.map((h) => (
                                    <div key={h.id_historial} className="border-b py-2 text-sm">
                                        <p>
                                            <strong>Fecha:</strong>{" "}
                                            {parseSqlDateTimeToLocal(h.fecha_cambio)
                                                ? parseSqlDateTimeToLocal(h.fecha_cambio).toLocaleString()
                                                : "-"}
                                        </p>
                                        <p><strong>Estado:</strong> {h.estado_anterior} → {h.estado_nuevo}</p>
                                        <p><strong>Administrador:</strong> {h.administrador_nombre}</p>
                                        <p className="text-gray-600">{h.descripcion}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No hay registros en el historial</p>
                            )}
                        </div>
                        <div className="text-right mt-4">
                            <button
                                onClick={cerrarModalHistorial}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ChatBot/> {/* Chat flotante */}
        </div>
    );
}
