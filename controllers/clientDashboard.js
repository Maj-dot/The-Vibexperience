const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isDJ = require('../middleware/isDJ');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');


router.get('/', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('reviews').exec();
        if (user.role !== 'client') {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const djs = await User.find({ role: 'dj' }); 

        res.render('clientDashboard/home.ejs', { user, djs });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

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
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;