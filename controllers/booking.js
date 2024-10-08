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
    res.render('bookings/new', { djs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const clientId = req.user._id;
    const { dj_id, event_date, location, total_hours, notes } = req.body;
    const newBooking = new Booking({
      dj_id,
      client_id: clientId,
      event_date,
      location,
      total_hours,
      notes,
    });
    await newBooking.save();
    res.redirect('/bookings'); 
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
    const clients = await User.find({ role: 'client' });
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
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (user.role === 'dj') {
      booking.dj_id = req.body.dj_id;
      booking.status = req.body.status;
      booking.notes = req.body.notes;
      booking.price = req.body.price;
    } else if (user.role === 'client') {
      booking.location = req.body.location;
      booking.notes = req.body.notes;
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await booking.save();

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