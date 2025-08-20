/**
 * App Express com middlewares globais e montagem das rotas.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Libera CORS para o frontend (React/Vue) em outro host/porta.
app.use(cors());

// Habilita JSON no corpo das requisições
app.use(express.json());

// Health-check simples para verificações rápidas
// app.get('/health', (req, res) => res.json({ ok: true }));
// app.get('/getFotos', (req, res) => res.send('<h1>Minhas fotos</h1>'));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Monta rotas de domínio
app.use('/auth', require('./routes/authRoutes'));
app.use('/photos', require('./routes/photoRoutes'));

module.exports = app;
