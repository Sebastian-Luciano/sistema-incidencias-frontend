// src/services/historialService.js
import { http } from "./httpClient";

const BASE = "/historiales";

// 🔹 Crear un nuevo historial (solo admin)
export const crearHistorial = (payload) => http.post(BASE, payload);

// Si en el futuro necesitas ver historial de una incidencia
export const obtenerHistoriales = (params = {}) => http.get(BASE, params);

export const obtenerHistorialPorIncidencia = (incidenciaId) =>
    http.get(`${BASE}/incidencia/${incidenciaId}`);