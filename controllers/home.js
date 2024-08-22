const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.get('/', (req, res) => {
  res.render('/');
});

router.get('/auth/sign-up', ensureLoggedIn, (req, res) => {
  res.send('Yay, you were logged in!');
});



module.exports = router;