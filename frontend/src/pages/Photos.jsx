// Lista simples de fotos consumindo GET /photos (público).
import { useEffect, useState } from 'react'
import api from '../api'

export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data } = await api.get('/photos')
        setPhotos(data)
      } catch (err) {
        setError('Erro ao carregar fotos')
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  if (loading) return <div className="center">Carregando fotos…</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h1>Fotos</h1>
      {photos.length === 0 && <p>Nenhuma foto ainda. Faça login e adicione a primeira!</p>}
      <div className="grid">
        {photos.map((p) => (
          <div key={p.id} className="card">
            {/* Renderiza a imagem a partir da URL fornecida */}
            {p.url && (
              <img src={p.url} alt={p.descricao || 'Foto'} className="photo" />
            )}
            <div className="card-body">
              <p className="desc">{p.descricao || 'Sem descrição'}</p>
              {p.usuario_id && (
                <small className="muted">Autor ID: {p.usuario_id}</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}