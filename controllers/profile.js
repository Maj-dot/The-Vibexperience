const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureLoggedIn');
const isDJ = require('../middleware/isDJ');
const { validationResult } = require('express-validator');
const User = require('../models/user'); 

router.get('/view', ensureAuthenticated, (req, res) => {
  res.render('profile/view', { user: req.session.user });
});


router.get('/edit', ensureAuthenticated, (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('profile/edit', { user: req.session.user });
});

router.post('/edit', ensureAuthenticated, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('profile/edit', { user: req.session.user, errors: errors.array() });
  }
  try {
    const { username, email, bio, social_links } = req.body;
    const userId = req.session.user._id;
    let updateData = {
      username,
      email,
      bio,
      social_links,
      reviews,
    };
    if (req.session.user.role === 'dj') {
      const { experience, sampleMixes } = req.body;
      updateData.experience = experience;
      updateData.sampleMixes = sampleMixes.split(',').map(mix => mix.trim());
    }
    await User.findByIdAndUpdate(userId, updateData);
    req.session.user.username = username;
    req.session.user.email = email;
    req.session.user.bio = bio;
    req.session.user.social_links = social_links;
    req.session.user.reviews = reviews;
    if (req.session.user.role === 'dj') {
      req.session.user.experience = updateData.experience;
      req.session.user.sampleMixes = updateData.sampleMixes;
    }
    res.redirect('/profile/view');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});;



module.exports = router;
