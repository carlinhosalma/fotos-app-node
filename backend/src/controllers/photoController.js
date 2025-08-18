/**
 * Controller de fotos:
 * - addPhoto (privado): cria foto (URL + descrição) para o usuário autenticado
 * - getPhotos (público): lista fotos (com nome do autor)
 */
const pool = require('../config/db');

exports.addPhoto = async (req, res) => {
  const { url, descricao } = req.body;

  // req.user vem do middleware auth (token válido)
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }
  if (!url) {
    return res.status(400).json({ message: 'url é obrigatória' });
  }

  try {
    await pool.query(
      'INSERT INTO fotos (url, descricao, usuario_id) VALUES (?, ?, ?)',
      [url, descricao || null, userId]
    );
    return res.status(201).json({ message: 'Foto adicionada com sucesso' });
  } catch (err) {
    console.error('[addPhoto] erro:', err);
    return res.status(500).json({ error: 'Erro ao adicionar foto' });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    // join simples para trazer o nome do autor
    const [rows] = await pool.query(
      `SELECT f.id, f.url, f.descricao, f.criado_em,
              u.id AS usuario_id, u.nome AS autor
         FROM fotos f
         JOIN usuarios u ON u.id = f.usuario_id
       ORDER BY f.criado_em DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('[getPhotos] erro:', err);
    return res.status(500).json({ error: 'Erro ao listar fotos' });
  }
};
