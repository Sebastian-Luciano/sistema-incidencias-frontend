import { useEffect, useState } from "react";
import {
    obtenerEstados,
    crearEstado,
    actualizarEstado,
    eliminarEstado,
} from "../services/estadoService";
import { FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";

export default function AdminEstados() {
    const [estados, setEstados] = useState([]);
    const [nuevo, setNuevo] = useState("");
    const [editando, setEditando] = useState(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

    const cargar = async () => {
        try {
            const data = await obtenerEstados();
            setEstados(Array.isArray(data) ? data : data?.data ?? []);
        } catch (err) {
            console.error("Error cargando estados:", err);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nuevo.trim()) return;
        try {
            await crearEstado({ nombre: nuevo });
            setNuevo("");
            cargar();
        } catch (err) {
            console.error("Error creando estado:", err);
        }
    };

    const handleActualizar = async (id, nombre) => {
        try {
            await actualizarEstado(id, { nombre });
            setEditando(null);
            cargar();
        } catch (err) {
            console.error("Error actualizando estado:", err);
        }
    };

    const handleEliminar = async () => {
        try {
            await eliminarEstado(estadoSeleccionado.id_estado);
            setModalDeleteOpen(false);
            setEstadoSeleccionado(null);
            cargar();
        } catch (err) {
            console.error("Error eliminando estado:", err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Gestión de Estados</h1>

            <form onSubmit={handleCrear} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nuevo estado"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
                    <FiPlus /> Agregar
                </button>
            </form>

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2">ID</th>
                        <th className="border px-3 py-2">Nombre</th>
                        <th className="border px-3 py-2 w-32 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estados.map((est, index) => (
                        <tr key={est.id_estado} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 text-center">{index + 1}</td>
                            <td className="border px-3 py-2">
                                {editando === est.id_estado ? (
                                    <input
                                        type="text"
                                        defaultValue={est.nombre}
                                        onBlur={(e) => handleActualizar(est.id_estado, e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                        autoFocus
                                    />
                                ) : (
                                    est.nombre
                                )}
                            </td>
                            <td className="border px-3 py-2 flex justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            setEditando(editando === est.id_estado ? null : est.id_estado)
                                        }
                                        className="px-2 py-1 border rounded hover:bg-gray-100 flex items-center gap-1"
                                    >
                                        <FiEdit2 />Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEstadoSeleccionado(est);
                                            setModalDeleteOpen(true); 
                                        }}
                                        className="px-2 py-1 border rounded hover:bg-gray-100 flex items-center gap-1 text-red-600"
                                    >
                                        <FiTrash2 /> Eliminar
                                    </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de confirmación */}
            {modalDeleteOpen && estadoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Confirmar eliminación</h2>
                            <button
                                className="hover:bg-gray-200 p-1 rounded"
                                onClick={() => setModalDeleteOpen(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <p className="text-gray-700 mb-4">
                            ¿Seguro que deseas eliminar el estado{" "}
                            <b>{estadoSeleccionado.nombre}</b>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalDeleteOpen(false)}
                                className="px-3 py-2 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEliminar}
                                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
