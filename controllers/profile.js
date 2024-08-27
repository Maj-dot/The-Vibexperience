const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureLoggedIn');
const { validationResult } = require('express-validator');
const User = require('../models/user'); 

router.get('/view', ensureAuthenticated, (req, res) => {
  res.render('profile/view', { user: req.session.user });
});

router.post('/edit', ensureAuthenticated, [
  // Validation logic here
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('profile/edit', { user: req.session.user, errors: errors.array() });
  }

  try {
    const { username, email, bio, social_links } = req.body;
    const userId = req.session.user._id;

    await User.findByIdAndUpdate(userId, {
      username,
      email,
      bio,
      social_links,
    });

    req.session.user.username = username;
    req.session.user.email = email;
    req.session.user.bio = bio;
    req.session.user.social_links = social_links;

    res.redirect('/profile/view');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/edit', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login'); 
  }
  res.render('profile/edit', { user: req.session.user });
});

router.post('/edit', async (req, res) => {
  try {
    const { username, email, bio, social_links } = req.body;
    const userId = req.session.user._id;

    await User.findByIdAndUpdate(userId, {
      username,
      email,
      bio,
      social_links,
    });

    req.session.user.username = username;
    req.session.user.email = email;
    req.session.user.bio = bio;
    req.session.user.social_links = social_links;

    res.redirect('/profile/edit');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
