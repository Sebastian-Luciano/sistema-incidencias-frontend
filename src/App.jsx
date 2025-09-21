// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NuevaIncidencia from "./pages/NuevaIncidencia";
import MainLayout from "./layouts/MainLayout";
import AdminEstados from "./pages/AdminEstados";
import AdminCategorias from "./pages/AdminCategorias";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas dentro de MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nueva-incidencia" element={<NuevaIncidencia />} />
            <Route path="/admin/estados" element={<AdminEstados />} />
            <Route path="/admin/categorias" element={<AdminCategorias />} />
          </Route>

          {/* Redirigir por defecto */}
          <Route path="*" element={<Login />} />
        </Routes>

        {/* ✅ Contenedor global de notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

