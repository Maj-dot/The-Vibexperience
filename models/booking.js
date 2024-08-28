const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    dj_id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled', 'completed'],
        default: 'inquired'
    },
    notes: {
        type: String,
    },
    total_hours: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

bookingSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;