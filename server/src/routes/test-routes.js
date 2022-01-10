const express = require('express');
const os = require('os');

const router = express.Router();

/**
 * Dans `server.js`, le router TEST est spécifié comme “/test”,
 * ce qui signifie que les routes utilisent des alias :
 * “/route-name” est donc traduit en “test/route-name”
 */
// requête GET pour retrouver toutes les scores
router.get('/request', (req, res) => {
  res.send({ username: os.userInfo().username });
});

module.exports = router;
