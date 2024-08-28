const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const User = require('../models/user');
const  ensureLoggedIn  = require('../middleware/ensureLoggedIn');

router.post('/djs/:id/reviews', ensureLoggedIn, async (req, res) => {
  try {
      const { content, rating, dj_id } = req.body;
      const review = new Review({
          content,
          rating,
          author: req.session.user._id,
          dj: dj_id,
      });
      await review.save();

      const dj = await User.findById(dj_id);
      dj.reviews.push(review);
      await dj.save();

      res.redirect(`/djs/${dj_id}`);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

router.get('/djs/:id/reviews/:reviewId/edit', ensureLoggedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).send('Review not found');
    }
    res.render('reviews/edit', { review });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/djs/:id/reviews/:reviewId', ensureLoggedIn, async (req, res) => {
  try {
    const { content, rating } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.reviewId, { content, rating }, { new: true });
    res.redirect(`/djs/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/djs/:id/reviews/:reviewId', ensureLoggedIn, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/djs/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;