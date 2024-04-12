const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'blocked'],
        default: 'requested'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
