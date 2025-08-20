/**
 * Controller de autenticação:
 * - register: cria usuário com senha hash (bcrypt)
 * - login: valida credenciais e emite token JWT
 */
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  const { nome, email, senha , invited_by } = req.body;

  // Validações simples 
  if (!nome || !email || !senha || !invited_by)  {
    return res.status(400).json({ message: 'nome, email, patrocinador e senha são obrigatórios' });
  }

  // Verifica se o convidador existe
    const [inviter] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [invited_by])
    if (inviter.length === 0) {
      return res.status(400).json({ message: "Convite inválido: usuário convidador não existe" })
    }


  try {
    // Verifica se e-mail já está em uso
    const [found] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (found.length > 0) {
      return res.status(409).json({ message: 'Email já registrado' });
    }

    // Cria UUID
    const id = uuidv4();

    // Gera hash seguro
    const hash = await bcrypt.hash(senha, 10);

    // Insere usuário
    const [result] = await pool.query(
      'INSERT INTO usuarios (id, nome, email, senha, invited_by) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, hash, invited_by]
    );

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      userId: id,
      invited_by: invited_by
    });
  } catch (err) {

    console.error('[register] erro:', err);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};



exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'email e senha são obrigatórios' });
  }
 
  try {
    // Busca usuário por e-mail
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = rows[0];

    // Compara senha
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Emite JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({ 
      'token': token , 
      'id': user.id,
      'nome': user.nome, 
      'email':user.email,
      'invited_by':user.invited_by
     });

  } catch (err) {
    console.error('[login] erro:', err);
    return res.status(500).json({ error: 'Erro ao efetuar login' });
  }
};

// Rota opcional para listar quem você convidou
exports.myInvites = async (req, res) => {
  
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE invited_by = ?", [req.user.id])
 try{
    res.json(rows)
 }catch{
   return res.status(500).json({ error: 'Erro o usuario é: ' + req.user.id});
 } 
}

// 📌 Ver rede até 10 níveis
exports.netWork = async (req, res) => {
  
    const userId = req.user.id;

    // Função recursiva para buscar níveis
    async function getLevel(usersIds, level, maxLevel = 10) {
      if (level > maxLevel || usersIds.length === 0) return [];

      // Busca todos os convidados de quem está neste nível
      const [rows] = await pool.query(
        "SELECT id, nome, email FROM usuarios WHERE invited_by IN (?)",
        [usersIds]
      );

      // Se não achou ninguém, retorna vazio
      if (rows.length === 0) return [];

      // Busca o próximo nível
      const nextLevel = await getLevel(rows.map(u => u.id), level + 1, maxLevel);

      return [{ level, users: rows }, ...nextLevel];
    }

    // Começa pelo usuário logado → nível 1
    const network = await getLevel([userId], 1, 10);

    res.json({ network });
  
};


// 📌 Ver quantidade de cadastrados até 10 níveis
exports.CoutNetwork = async (req, res) => {

      const userId = req.user.id;

    // Função recursiva para contar usuários por nível
    async function countLevel(usersIds, level, maxLevel = 10) {
      if (level > maxLevel || usersIds.length === 0) return [];

      // Busca todos os convidados diretos de quem está neste nível
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE invited_by IN (?)",
        [usersIds]
      );

      const count = rows.length;

      // Busca o próximo nível
      const nextLevel = await countLevel(rows.map(u => u.id), level + 1, maxLevel);

      return [{ level, count }, ...nextLevel];
    }

    const networkCount = await countLevel([userId], 1, 10);

    res.json({ networkCount });
 
};



// 📌 Quantidade de cadastrados até 10 níveis (SQL otimizado com WITH RECURSIVE)
exports.RecursiveNetwork = async (req, res) => {
  
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      WITH RECURSIVE user_tree AS (
        SELECT id, invited_by, 1 AS level
        FROM usuarios
        WHERE invited_by = ?

        UNION ALL

        SELECT u.id, u.invited_by, ut.level + 1
        FROM usuarios u
        INNER JOIN user_tree ut ON u.invited_by = ut.id
        WHERE ut.level < 10
      )
      SELECT level, COUNT(*) AS count
      FROM user_tree
      GROUP BY level
      ORDER BY level;
      `,
      [userId]
    );

    // Garante que sempre retorna até 10 níveis (mesmo que 0 em alguns)
    const result = Array.from({ length: 10 }, (_, i) => {
      const row = rows.find(r => r.level === i + 1);
      return { level: i + 1, count: row ? row.count : 0 };
    });

    res.json({ networkCount: result });
  
  
};







