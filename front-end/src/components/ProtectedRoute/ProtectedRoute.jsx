import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // caso não esteja logado
    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // caso não tenha permissão
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    // autorizado
    return children;
}
