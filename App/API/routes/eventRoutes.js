const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');

// Get all events for a user
router.get('/events', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user._id });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Add a new event
router.post('/events', authMiddleware, async (req, res) => {
    const { date, name, time, location } = req.body;
    console.log('Received request to add event:', req.body); // Log the request body

    try {
        const event = new Event({
            userId: req.user._id,
            date,
            name,
            time,
            location,
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Error adding event' });
    }
});

// Delete an event
router.delete('/events/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router;
