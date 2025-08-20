
/**
 * Middleware de autenticação via JWT.
 * - Lê o header Authorization: "Bearer <token>"
 * - Valida o token usando JWT_SECRET
 * - Coloca os dados do usuário decodificados em req.user
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function auth(req, res, next) {
  // MAPEAMENTO

  pag = ' <h1> /middleware/auth </h1> ';


  // Authorization: Bearer xxx.yyy.zzz
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ message: 'Token não fornecido' + pag });
  }

  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return res.status(401).json({ message: 'Token inválido no header' + pag });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded pode conter: { id, email, iat, exp }
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' + pag });
  }
};

