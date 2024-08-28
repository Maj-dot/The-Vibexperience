const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const isDJ = require('../middleware/isDJ');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const user = req.session.user
  if (user?.role==='dj') {
    res.redirect('/djDashboard');
  } else if (user?.role==='client') {
    res.redirect('/clientDashboard');
  } else {
    res.render('home.ejs')
  }
});




module.exports = router;