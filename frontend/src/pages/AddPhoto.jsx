import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function AddPhoto() {
  const [url, setUrl] = useState("")
  const [descricao, setDescricao] = useState("")
  const [mensagem, setMensagem] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMensagem("")

    try {
      await api.post("/photos", { url, descricao })
      setMensagem("✅ Foto adicionada com sucesso!")
      setUrl("")
      setDescricao("")

      // Redireciona para a página de fotos após 1s
      setTimeout(() => navigate("/"), 1000)
    } catch (err) {
      setMensagem("❌ Erro: " + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div>
      <h1>Adicionar Foto</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>URL da Imagem</label>
          <input
            type="url"
            placeholder="https://exemplo.com/foto.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Minha foto"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <button type="submit">Salvar</button>
      </form>

      {mensagem && <p>{mensagem}</p>}

      {url && (
        <div>
          <h3>Pré-visualização:</h3>
          <img
            src={url}
            alt="preview"
            style={{ maxWidth: "300px", border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  )
}
