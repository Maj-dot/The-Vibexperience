const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const user = req.session.user
  console.log(user);
  if (user?.role==='dj') {
    res.render('djDashboard/home.ejs')
  } else if (user?.role==='client') {
    res.render('clientDashboard/home.ejs')
  } else {
    res.render('home.ejs')
  }
});




module.exports = router;