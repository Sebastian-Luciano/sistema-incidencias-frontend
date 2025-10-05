// src/pages/AdminFAQs.jsx
import { useEffect, useState } from "react";
import { obtenerFAQs, crearFAQ, eliminarFAQ, actualizarFAQ } from "../services/faqService";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function AdminFAQs() {
    const [faqs, setFaqs] = useState([]);
    const [keywords, setKeywords] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [loading, setLoading] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    // cargar FAQs
    const cargarFAQs = async () => {
        try {
            setLoading(true);
            const data = await obtenerFAQs();
            setFaqs(data);
        } catch (err) {
            toast.error("❌ Error al cargar FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarFAQs();
    }, []);

    // crear o editar
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
            respuesta,
        };

        try {
            if (editIndex !== null) {
                // Editando
                await actualizarFAQ(faqs[editIndex].id, payload);
                toast.success("✏️ FAQ actualizada correctamente");
            } else {
                // Creando
                await crearFAQ(payload);
                toast.success("✅ FAQ creada correctamente");
            }

            setKeywords("");
            setRespuesta("");
            setEditIndex(null);
            cargarFAQs();
        } catch (err) {
            console.error("Error guardando FAQ:", err);
            toast.error("❌ Error al guardar FAQ");
        }
    };

    // preparar edición
    const handleEdit = (index) => {
        setEditIndex(index);
        setKeywords(faqs[index].keywords.join(", "));
        setRespuesta(faqs[index].respuesta);
    };

    // confirmación de borrado
    const confirmDelete = async () => {
        try {
            await eliminarFAQ(faqToDelete); // 👈 ahora usa el id guardado
            toast.success("🗑️ FAQ eliminada correctamente");
            cargarFAQs();
        } catch (err) {
            toast.error("❌ Error al eliminar FAQ");
        } finally {
            setFaqToDelete(null); // cerrar modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Administrar FAQs</h1>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="mb-6 p-4 bg-white rounded shadow space-y-3"
            >
                <div>
                    <label className="block font-medium">
                        Palabras clave (separadas por coma)
                    </label>
                    <input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="ej: hola, registrar, incidencia"
                    />
                </div>

                <div className="relative">
                    <label className="block font-medium">Respuesta del Bot</label>
                    <textarea
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        rows={3}
                        placeholder="Escribe la respuesta que el bot enviará"
                    />
                    <button
                        type="button"
                        className="absolute right-3 bottom-3 text-2xl"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        😊
                    </button>
                    {showEmojiPicker && (
                        <div className="absolute right-0 z-10">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                    setRespuesta((prev) => prev + emojiData.emoji);
                                    setShowEmojiPicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    {editIndex !== null ? "✏️ Actualizar FAQ" : "➕ Agregar FAQ"}
                </button>
            </form>

            {/* Listado con scroll */}
            <div className="bg-white rounded shadow p-3 max-h-96 overflow-y-auto space-y-3">
                {loading && <p className="text-gray-500">Cargando FAQs...</p>}
                {!loading && faqs.length === 0 && (
                    <p className="text-gray-500 text-center">No hay FAQs registradas</p>
                )}
                {faqs.map((faq, index) => (
                    <div
                        key={faq.id || index} // 👈 key con id
                        className="p-3 bg-gray-50 border rounded flex justify-between items-center"
                    >
                        <div>
                            <p className="text-sm text-gray-600">
                                <strong>Keywords:</strong> {faq.keywords.join(", ")}
                            </p>
                            <p>{faq.respuesta}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded"
                                onClick={() => handleEdit(index)}
                            >
                                <FiEdit2 />
                            </button>
                            <button
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                onClick={() => setFaqToDelete(faq.id)} // 👈 guardamos id
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de confirmación */}
            {faqToDelete !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            ¿Eliminar esta FAQ?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Esta acción no se puede deshacer. La FAQ será eliminada permanentemente.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 border rounded"
                                onClick={() => setFaqToDelete(null)} // 👈 corregido (antes estaba mal)
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                onClick={confirmDelete}
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
