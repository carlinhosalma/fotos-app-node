// src/App.jsx
// Arquivo principal de rotas

import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

// Páginas
import Login from "./pages/Login"
import Register from "./pages/Register"
import Photos from "./pages/Photos"
import AddPhoto from "./pages/AddPhoto"
import Principal from "./pages/Principal"

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Photos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddPhoto />
            </ProtectedRoute>
          }
        />

        {/* Se a rota não existir, redireciona para / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
