const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.get('/', async (req, res) => {
  try {
    const djs = await User.find({ role: 'dj' }); 
    res.render('djs/index.ejs', { djs });
  } catch (err) {
    res.status(500).send('Error fetching DJs');
  }
});


router.get('/:id', async (req, res) => {
  try {
    const dj = await User.findById(req.params.id).populate('reviews');
    console.log(dj)
    if (!dj || dj.role !== 'dj') {
      return res.status(404).send('DJ not found');
    }
    res.render('djs/show', { dj, });
  } catch (err) {
    res.status(500).send('Error retrieving DJ profile');
  }
});

module.exports = router;