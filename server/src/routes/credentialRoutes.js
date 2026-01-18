const express = require('express');
const router = express.Router();
const { addCredential, getCredentials, deleteCredential } = require('../controllers/credentialController');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken); // Protect all routes

router.post('/', addCredential);
router.get('/', getCredentials);
router.delete('/:id', deleteCredential);

module.exports = router;
