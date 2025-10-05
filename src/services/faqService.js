// src/services/faqService.js
import { http } from "./httpClient";

// Obtener todas las FAQs
export const obtenerFAQs = () => http.get("/ia/faqs");

// Crear FAQ
export const crearFAQ = (payload) => http.post("/ia/faqs", payload);

// Actualizar FAQ
export const actualizarFAQ = (id, payload) => http.put(`/ia/faqs/${id}`, payload);

// Eliminar FAQ
export const eliminarFAQ = (id) => http.del(`/ia/faqs/${id}`);
