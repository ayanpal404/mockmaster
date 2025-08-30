const express = require('express');
const { uploadCV, searchCVs, getAllCVs } = require('../controllers/cvController');
const auth = require('../middlewares/auth');
const upload = require('../utils/upload');

const router = express.Router();

// Upload CV (protected route - requires authentication)
router.post('/upload', auth, upload.single('cv'), uploadCV);

// Search CVs (protected route)
router.get('/search', auth, searchCVs);

// Get all CVs (protected route)
router.get('/all', auth, getAllCVs);

module.exports = router;
