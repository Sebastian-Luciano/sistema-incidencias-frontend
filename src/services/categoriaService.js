// src/services/categoriaService.js
import { http } from "./httpClient";

/**
 * 🔹 Servicio de categorías
 * Maneja operaciones CRUD contra / categorias
 */

// Obtener todas las categorias
export const obtenerCategorias = () => http.get(`/categorias`);

// Obtener una categoría por ID
export const obtenerCategoriaById = (id) => http.get(`/categorias/${id}`);

// Crear nueva categoría
export const crearCategoria = (payload) => http.post("/categorias", payload);

// Actualizar categoría existente
export const actualizarCategoria = (id, payload) => http.put(`/categorias/${id}`, payload);

// Eliminar categoría
export const eliminarCategoria = (id) => http.del(`/categorias/${id}`);

