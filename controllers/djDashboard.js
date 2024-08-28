const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

router.get('/', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate({path:'reviews', populate:{path:'author'}}).exec();
        if (user.role !== 'dj') {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        res.render('djDashboard/home', { user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;