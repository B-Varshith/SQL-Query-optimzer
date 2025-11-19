const express = require('express');
const router = express.Router();
const { analyzeQuery } = require('../controllers/analyzeController');

router.post('/analyze', analyzeQuery);

module.exports = router;
