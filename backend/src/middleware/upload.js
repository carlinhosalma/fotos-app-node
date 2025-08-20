// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + extensão original
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro: só aceitar imagens
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido. Envie apenas JPG ou PNG."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // limite: 2MB
});

module.exports = upload;
