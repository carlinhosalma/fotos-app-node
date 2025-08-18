/**
 * Controller de autenticação:
 * - register: cria usuário com senha hash (bcrypt)
 * - login: valida credenciais e emite token JWT
 */
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validações simples
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'nome, email e senha são obrigatórios' });
  }

  try {
    // Verifica se e-mail já está em uso
    const [found] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (found.length > 0) {
      return res.status(409).json({ message: 'Email já registrado' });
    }

    // Gera hash seguro
    const hash = await bcrypt.hash(senha, 10);

    // Insere usuário
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, hash]
    );

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      userId: result.insertId
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

    return res.json({ token });
  } catch (err) {
    console.error('[login] erro:', err);
    return res.status(500).json({ error: 'Erro ao efetuar login' });
  }
};
