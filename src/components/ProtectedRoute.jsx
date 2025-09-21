// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { usuario, loading } = useAuth();

    if (loading) {
        return <div className="p-6">Cargando...</div>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
