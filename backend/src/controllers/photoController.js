/**
 * Controller de fotos:
 * - addPhoto (privado): cria foto (URL + descrição) para o usuário autenticado
 * - getPhotos (público): lista fotos (com nome do autor)
 */
const pool = require('../config/db');
const { v4: uuidv4 } = require("uuid");

exports.addPhoto = async (req, res) => {
  const { url, descricao } = req.body;

  // req.user vem do middleware auth (token válido)
  const userId = req.user?.id;
  const photoId = uuidv4()

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }
  if (!url) {
    return res.status(400).json({ message: 'url é obrigatória' });
  }

  try {
    await pool.query(
      'INSERT INTO fotos (id,  url,  descricao, usuario_id) VALUES (?, ?, ? ,?)',
      [photoId, url, descricao || null, userId]
    );
    return res.status(201).json({ message: 'Foto adicionada com sucesso' });
  } catch (err) {
    console.error('[addPhoto] erro:', err);
    qr = [photoId, url, descricao || null, userId];
    return res.status(500).json({ error: 'Erro ao adicionar foto'+ qr  });
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

exports.myPhotos = async (req, res) => {
  
  try {
    // join simples para trazer o nome do autor
    const [rows] = await pool.query( "SELECT *  FROM fotos WHERE usuario_id = ?", [req.user.id]);
    
   return res.json(rows);
   //res.status(200).json(rows); // Retorna as fotos em formato JSON

  } catch (err) {
    console.error('[getPhotos] erro:', err);
    return res.status(500).json({ error: 'Erro ao listar fotos' });
  }

};

exports.delPhoto = async (req, res) => {
    const { id } = req.params;

   // Verifica se a foto pertence ao usuário logado
    const [rows] = await pool.query(
      "SELECT * FROM fotos WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Foto não encontrada ou você não tem permissão para excluir"  })
    }

    await pool.query("DELETE FROM fotos WHERE id = ?", [id])

    res.json({ message: "Foto deletada com sucesso" })

  
  try {
    // join simples para trazer o nome do autor
    const [rows] = await pool.query( "SELECT *  FROM fotos WHERE usuario_id = ?", [req.user.id]);
    
   return res.json(rows);
   //res.status(200).json(rows); // Retorna as fotos em formato JSON

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao deletar foto" })
  }

};


exports.putPhoto = async (req, res) => {
    const { id } = req.params;
    const { descricao, url } = req.body

   // Verifica se a foto pertence ao usuário logado
    const [rows] = await pool.query(
      "SELECT * FROM fotos WHERE id = ? AND usuario_id = ?",
      [id, req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "Foto não encontrada ou você não tem permissão para editar "  })
    }

    await pool.query("UPDATE fotos SET descricao = ?, url = ? WHERE id = ?", [descricao, url, id])

    res.json({ message: "Foto atualizada com sucesso" })

  
  try {
    // join simples para trazer o nome do autor
    const [rows] = await pool.query( "SELECT *  FROM fotos WHERE usuario_id = ?", [req.user.id]);
    
   return res.json(rows);
   //res.status(200).json(rows); // Retorna as fotos em formato JSON

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao deletar foto" })
  }

};








   

