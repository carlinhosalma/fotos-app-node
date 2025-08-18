// Navbar simples com links condicionais conforme estado de login.
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">Meu Álbum</Link>
        <Link to="/">Fotos</Link>
        {user && <Link to="/add">Adicionar Foto</Link>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="welcome">Olá, {user.email}</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Registrar</Link>
          </>
        )}
      </div>
    </nav>
  )
}