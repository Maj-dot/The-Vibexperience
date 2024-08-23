const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');


// Create New Booking
const createBooking = (req,res) => {
    const newBooking = new Booking({
        dj_id: req.body.dj_id,
        client_id: req.body.client_id,
        event_date: req.body.event_date,
        location: req.body.location,
        status: req.body.status,
        total_cost: req.body.total_cost,
        notes: req.body.notes
    });

    newBooking.save()
};

// Get booking by ID
const getBookingById = (req, res) => {
    Booking.findById(req.params.id)
    .populate('dj_id')
    .populate('client_id')
    .then(booking => res.json(booking))
    .catch(err => res.status(404).json({error: 'Booking not found'}));
}

router.post('/bookings', createBooking);
router.get('/bookings/:id', getBookingById);

module.exports = router;