const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const isDJ = require('../middleware/isDJ');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const User = require('../models/user');



router.get('/new', async (req, res) => {
    try {
        const djs = await User.find({ role: 'dj' });
        const clients = await User.find({ role: 'client' });
        res.render('bookings/new', { djs, clients });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
  console.log(req.body);
    try {
      const djs = await User.findOne({ _id: req.body.dj_id });
      if (!djs) throw new Error('DJ not found');
      const client = await User.findOne({ _id: req.body.client_id });
      if (!client) throw new Error('Client not found');
      const newBooking = new Booking({
        dj_id: req.body.dj_id, 
        client_id: req.body.client_id, 
        event_date: req.body.event_date,
        total_hours: req.body.total_hours,
        location: req.body.location,
        status: req.body.status,
        notes: req.body.notes
      });
      const booking = await newBooking.save();
      res.redirect(`/bookings/${booking._id}`);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      let bookings;
      if (userRole === 'dj') {
        bookings = await Booking.find({ dj_id: userId }).populate('client_id');
      } else if (userRole === 'client') {
        bookings = await Booking.find({ client_id: userId }).populate('dj_id');
      } else {
        return res.status(403).send('Unauthorized');
      } 
      res.render('bookings/index.ejs', { bookings });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('dj_id')
      .populate('client_id');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.render('bookings/show', { booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const djs = await User.find({ role: 'dj' });
        console.log('DJs', djs);
        const clients = await User.find({ role: 'client' });
        console.log('Clients', clients);
    const booking = await Booking.findById(req.params.id).populate('dj_id').populate('client_id');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.render('bookings/edit', { booking, clients, djs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      dj_id: req.body.dj_id,
      client_id: req.body.client_id,
      event_date: req.body.event_date,
      location: req.body.location,
      total_hours: req.body.total_hours,
      status: req.body.status,
      notes: req.body.notes
    }, { new: true }); 
    res.redirect(`/bookings/${booking._id}`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;