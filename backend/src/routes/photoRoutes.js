const express = require('express');
const router = express.Router();
const { addPhoto, getPhotos } = require('../controllers/photoController');
const auth = require('../middleware/auth');

router.post('/', auth, addPhoto);
router.get('/', getPhotos);

module.exports = router;
