import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  return localStorage.getItem("storySphereToken") ? children : <Navigate to="/login" replace />;
}
