const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const Booking = require('../models/Booking');
const User = require('../models/user');


router.get('/new', async (req, res) => {
    try {
        const djs = await User.find({ role: 'DJ' });
        const clients = await User.find({ role: 'Client' });

        res.render('bookings/new', { djs, clients });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
      
      const dj = await User.findOne({ dj_name: req.body.dj_name });
      if (!dj) throw new Error('DJ not found');
  
      const client = await User.findOne({ username: req.body.client_name });
      if (!client) throw new Error('Client not found');
  
      const newBooking = new Booking({
        dj_id: req.body.dj_id, 
        client_id: req.body.client_id, 
        event_date: req.body.event_date,
        location: req.body.location,
        status: req.body.status,
        total_cost: req.body.total_cost,
        notes: req.body.notes
      });
  
      const booking = await newBooking.save();
      res.redirect(`/bookings/${booking._id}`);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.get('/index', (req, res) => {
    Booking.find()
        .populate('dj_id')
        .populate('client_id')
        .then(bookings => res.render('bookings/index.ejs', { bookings }))
        .catch(err => res.status(400).json({ error: err.message }));
});


module.exports = router;