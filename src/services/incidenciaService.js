// src/services/incidenciaService.js
import { http } from "./httpClient";

const BASE_PATH = "/incidencias";

// admin: admite query params page, limit, estado_id, categoria_id, q
export const obtenerIncidenciasAdmin = (params = {}) => http.get(BASE_PATH, params);

// usuario: obtiene solo sus incidencias (backend las limita)
export const obtenerMisIncidencias = (params = {}) => http.get(`${BASE_PATH}/mias`, params);

export const obtenerIncidencia = (id) => http.get(`${BASE_PATH}/${id}`);

export const crearIncidencia = (payload) => http.post(BASE_PATH, payload);

export const actualizarIncidencia = (id, payload) => http.put(`${BASE_PATH}/${id}`, payload);

export const eliminarIncidencia = (id) => http.del(`${BASE_PATH}/${id}`);
