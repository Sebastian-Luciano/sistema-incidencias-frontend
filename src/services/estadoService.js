// src/services/estadoService.js
import { http } from "./httpClient";

/**
 * 🔹 Servicio de Estado
 * Maneja operaciones CRUD contra /estados
 */

// Obtener todos los estados
export const obtenerEstados = () => http.get("/estados");

// Obtener un estado por ID
export const obtenerEstadoById = (id) => http.get(`/estados/${id}`);

// Crear nuevo estado
export const crearEstado = (payload) => http.post("/estados", payload);

// Actualizar estado existente
export const actualizarEstado = (id, payload) => http.put(`/estados/${id}`, payload);

// Eliminar estado
export const eliminarEstado = (id) => http.del(`/estados/${id}`);