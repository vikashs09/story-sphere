import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import SearchUsers from "./pages/SearchUsers";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    document.documentElement.dataset.theme = localStorage.getItem("storySphereTheme") || "sphere";
    document.documentElement.classList.toggle("compact-mode", localStorage.getItem("storySphereCompact") === "true");
    document.documentElement.classList.toggle("reduced-motion", localStorage.getItem("storySphereReducedMotion") === "true");
  }, []);
  return <BrowserRouter><Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
    <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
    <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/search" element={<ProtectedRoute><SearchUsers /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
export default App;
