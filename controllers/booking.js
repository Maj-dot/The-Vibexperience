const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');


//Create new booking
router.get('/new', (req, res) => {
    res.render('bookings/new.ejs');
});

//Handle creation of new booking
router.post('/', (req, res) => {
    const newBooking = Booking({
        dj_id: req.body.dj_id,
        client_id: req.body.client_id,
        event_date: req.body.event_date,
        location: req.body.location,
        status: req.body.status,
        total_cost: req.body.total_cost,
        notes: req.body.notes
    });

    newBooking.save()
    res.redirect('/bookings')
});


module.exports = router;