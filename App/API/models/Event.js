const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    time: String,
    location: String,
});

module.exports = mongoose.model('Event', eventSchema);
