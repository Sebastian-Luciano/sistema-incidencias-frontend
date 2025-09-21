import { useState } from "react";
import { actualizarIncidencia } from "../services/incidenciaService";

export default function ModalEstado({ open, onClose, incidencia, estados, onSuccess }) {
    const [estadoId, setEstadoId] = useState(incidencia?.estado_id ?? "");

    if (!open || !incidencia) return null;

    const handleUpdate = async () => {
        try {
            await actualizarIncidencia(incidencia.id_incidencia, { estado_id: estadoId });
            onSuccess();
            onClose();
        } catch (err) {
            alert("❌ Error al actualizar el estado");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Cambiar Estado</h2>
                <select
                    value={estadoId}
                    onChange={(e) => setEstadoId(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                >
                    {estados.map((est) => (
                        <option key={est.id_estado} value={est.id_estado}>
                            {est.nombre}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                        Cancelar
                    </button>
                    <button onClick={handleUpdate} className="px-3 py-1 bg-blue-600 text-white rounded">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
