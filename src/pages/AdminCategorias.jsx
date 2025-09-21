import { useEffect, useState } from "react";
import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../services/categoriaService";
import { FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [nuevo, setNuevo] = useState("");
    const [editando, setEditando] = useState(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const cargar = async () => {
        try {
            const data = await obtenerCategorias();
            setCategorias(Array.isArray(data) ? data : data?.data ?? []);
        } catch (err) {
            console.error("Error cargando categorías:", err);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!nuevo.trim()) return;
        try {
            await crearCategoria({ nombre: nuevo });
            setNuevo("");
            cargar();
        } catch (err) {
            console.error("Error creando categoría:", err);
        }
    };

    const handleActualizar = async (id, nombre) => {
        try {
            await actualizarCategoria(id, { nombre });
            setEditando(null);
            cargar();
        } catch (err) {
            console.error("Error actualizando categoría:", err);
        }
    };

    const handleEliminar = async () => {
        try {
            await eliminarCategoria(categoriaSeleccionada.id_categoria);
            setModalDeleteOpen(false);
            setCategoriaSeleccionada(null);
            cargar();
        } catch (err) {
            console.error("Error eliminando categoría:", err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Gestión de Categorías</h1>

            {/* Formulario de nueva categoría */}
            <form onSubmit={handleCrear} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nueva categoría"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
                    <FiPlus /> Agregar
                </button>
            </form>

            {/* Tabla de categorías */}
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2">ID</th>
                        <th className="border px-3 py-2">Nombre</th>
                        <th className="border px-3 py-2 w-32 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((cat, index) => (
                        <tr key={cat.id_categoria} className="hover:bg-gray-50">
                           {/* Índice dinámico */}
                            <td className="border px-3 py-2 text-center">{index + 1}</td>
                           
                            <td className="border px-3 py-2">
                                {editando === cat.id_categoria ? (
                                    <input
                                        type="text"
                                        defaultValue={cat.nombre}
                                        onBlur={(e) => handleActualizar(cat.id_categoria, e.target.value)}
                                        className="border rounded px-2 py-1 w-full"
                                        autoFocus
                                    />
                                ) : (
                                    cat.nombre
                                )}
                            </td>
                            <td className="border px-3 py-2 flex justify-center gap-2">
                                <button
                                    onClick={() =>
                                        setEditando(editando === cat.id_categoria ? null : cat.id_categoria)
                                    }
                                    className="px-2 py-1 border rounded hover:bg-gray-100 flex items-center gap-1"
                                >
                                    <FiEdit2 /> Editar
                                </button>
                                <button
                                    onClick={() => {
                                        setCategoriaSeleccionada(cat);
                                        setModalDeleteOpen(true);
                                    }}
                                    className="px-2 py-1 border rounded hover:bg-red-100 text-red-600 flex items-center gap-1"
                                >
                                    <FiTrash2 /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de confirmación */}
            {modalDeleteOpen && categoriaSeleccionada && (
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
                            ¿Seguro que deseas eliminar la categoría{" "}
                            <b>{categoriaSeleccionada.nombre}</b>?
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
