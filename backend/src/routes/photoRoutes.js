const express = require('express');
const router = express.Router();
const { addPhoto, getPhotos, myPhotos, delPhoto, putPhoto } = require('../controllers/photoController');
const auth = require('../middleware/auth');

// rotas públicas
router.get('/', getPhotos); //listas todas as  fotos

// rotas restritas
router.post('/', auth, addPhoto); //listas todas as  fotos
router.get('/myPhotos', auth, myPhotos ); //listas apenas minhas fotos
router.delete('/:id', auth, delPhoto ); //deleta foto
router.put('/:id', auth, putPhoto ); //atualiza foto



module.exports = router;
