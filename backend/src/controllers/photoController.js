/**
 * Controller de fotos:
 * - addPhoto (privado): cria foto (URL + descrição) para o usuário autenticado
 * - getPhotos (público): lista fotos (com nome do autor)
 */
const pool = require('../config/db');
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require('path');



exports.addPhoto = async (req, res) => {
  const { descricao } = req.body;
  const userId = req.user.id;

  if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

  const url = `/uploads/${req.file.filename}`;
  const photoId = uuidv4()

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }


  try {
    await pool.query(
      'INSERT INTO fotos (id,  url,  descricao, usuario_id) VALUES (?, ?, ? ,?)',
      [photoId, url, descricao || null, userId]
    );
    return res.status(201).json({ message: 'Foto adicionada com sucesso', photoId, url });
  } catch (err) {
    console.error('[addPhoto] erro:', err);
    qr = [photoId, url, descricao || null, userId];
    return res.status(500).json({ error: 'Erro ao enviar foto'+ qr  });
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

    const photo = rows[0];


    
    const filePath = path.join('uploads/', '..', photo.url);

    await pool.query("DELETE FROM fotos WHERE id = ?", [id]);

    // Apaga o arquivo físico, se existir
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erro ao excluir arquivo:', err.message);
        // não retornamos erro aqui, apenas logamos
      }
    });

    res.json({ message: "Foto deletada com sucesso" })

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



// Normaliza o caminho salvo no banco para um caminho absoluto no disco
function resolveUploadAbsolutePath(rawUrlFromDB) {
  if (!rawUrlFromDB) return null;

  // Ex.: '/uploads/foto.jpg' -> 'uploads/foto.jpg'
  // Ex.: 'uploads/foto.jpg'  -> 'uploads/foto.jpg'
  let rel = String(rawUrlFromDB).trim().replace(/^\/+/, '');

  // Se por algum motivo veio só 'foto.jpg', prefixa 'uploads/'
  if (!rel.startsWith('uploads')) {
    rel = path.join('uploads', rel);
  }

// Caminho absoluto a partir da raiz do backend
  const backendRoot = path.resolve(__dirname, '..'); // pasta do backend
  const abs = path.resolve(backendRoot, rel);        // .../backend/uploads/foto.jpg
  return abs;
}






   

