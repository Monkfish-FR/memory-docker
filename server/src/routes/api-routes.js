const express = require('express');

const apiRoutes = require('../controllers/api-controller');

const router = express.Router();

/**
 * Dans `server.js`, le router API est spécifié comme “/api”,
 * ce qui signifie que les routes utilisent des alias :
 * “/route-name” est donc traduit en “api/route-name”
 */
// requête GET pour retrouver toutes les scores
router.get('/scores/all', apiRoutes.scoresAll);
router.get('/scores/top', apiRoutes.scoresTop);

// requête POST pour ajouter un score
router.post('/scores/add', apiRoutes.scoreAdd);

module.exports = router;
