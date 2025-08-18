/**
 * Configuração do pool de conexões MySQL usando mysql2/promise.
 * O pool gerencia conexões reutilizáveis e melhora o desempenho.
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,            // host do banco
  user: process.env.DB_USER,            // usuário
  password: process.env.DB_PASS,        // senha
  database: process.env.DB_NAME,        // nome do banco
  waitForConnections: true,             // aguarda conexões quando o pool estiver cheio
  connectionLimit: 10,                  // máximo de conexões simultâneas
  queueLimit: 0                         // 0 = ilimitado
});

/**
 * (Opcional) - testar a conexão na inicialização para detectar problemas cedo.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[MySQL] Conectado com sucesso.');
  } catch (err) {
    console.error('[MySQL] Falha na conexão:', err.message);
  }
}
testConnection();

module.exports = pool;

