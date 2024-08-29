const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isDJ = require('../middleware/isDJ');
const Review = require('../models/review');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.get('/', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const djs = await User.find({ role: 'dj' });
    const reviews = await Review.find({ author: req.session.user._id }).populate('dj');
    const user = await User.findById(userId).populate('reviews').exec();
    if (user.role !== 'client') {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    res.render('clientDashboard/home.ejs', { user, djs, reviews });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/djs/:userId/reviews', ensureLoggedIn, async (req, res) => {
  try {
    const { content, rating, dj_id } = req.body;
    const review = new Review({
      content,
      rating,
      author: req.session.user._id,
      dj: dj_id,
    });
    await review.save();
    const djs = await User.findById(dj_id);
    dj.reviews.push(review);
    await djs.save();
    res.redirect(`/djs/${dj_id}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


module.exports = router;