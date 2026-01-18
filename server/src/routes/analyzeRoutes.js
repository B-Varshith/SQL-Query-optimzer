const express = require('express');
const router = express.Router();
const { analyzeQuery } = require('../controllers/analyzeController');

const authenticateToken = require('../middleware/auth');

router.post('/analyze', authenticateToken, analyzeQuery);

module.exports = router;
