// src/services/iaService.js
import { http } from "./httpClient";

const BASE = "/ia";

export const sugerirCategoria = (payload) => http.post(`${BASE}/sugerir-categoria`, payload);
