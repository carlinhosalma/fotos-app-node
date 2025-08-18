// Protege rotas: se não houver usuário logado, redireciona para /login.
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="center">Carregando…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}