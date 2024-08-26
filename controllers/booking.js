const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');



router.get('/new', (req, res) => {
    res.render('bookings/new.ejs');
});

router.post('/', (req, res) => {
    const newBooking = {
        dj_id: req.body.dj_id,
        client_id: req.body.client_id,
        event_date: req.body.event_date,
        location: req.body.location,
        status: req.body.status,
        total_cost: req.body.total_cost,
        notes: req.body.notes
    };

    newBooking.save(res.redirect('/'))   
});

router.get('/', (req, res) => {
    Booking.find()
        .populate('dj_id')
        .populate('client_id')
        .then(bookings => res.render('bookings/index', { bookings }))
        .catch(err => res.status(400).json({ error: err.message }));
});


module.exports = router;