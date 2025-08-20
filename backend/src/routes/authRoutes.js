/**
 * Rotas de autenticação:
 * - POST /auth/register
 * - POST /auth/login
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController'); 
const auth = require('../middleware/auth');


router.post('/login', ctrl.login);
router.post('/register', auth, ctrl.register);
router.get('/my-invites', auth , ctrl.myInvites);
router.get('/network', auth , ctrl.netWork );
router.get('/network/count', auth , ctrl.CoutNetwork );
router.get('/network/recursive', auth, ctrl.RecursiveNetwork );
router.post('/invite', auth, ctrl.Invite);




module.exports = router;
