const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password & confirmation do not match');
    }
    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = await User.create(req.body);
    // "remember" only the user's _id in the session object
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    req.session.save();
    if (user.role === 'dj') {
      return res.redirect('/djDashboard');
    } else if (user.role === 'client') {
      return res.redirect('/clientDashboard');
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect('/');
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {

      return res.redirect('/auth/login');
    }
    console.log(user, "In Auth");
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        social_links: user.social_links,
        role: user.role,
        experience: user.experience,
        sampleMixes: user.sampleMixes,
      };
      req.session.save();

      return res.redirect('/');
    } else {
      return res.redirect('/auth/login');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/login', async (req, res) => {
  res.render('auth/login.ejs');
});


router.get('/logout', (req, res) => {
  console.log('logout');
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;