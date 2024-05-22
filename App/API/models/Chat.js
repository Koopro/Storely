const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            text: { type: String },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, required: true },
            index: { type: Number, required: true },
            mediaUrl: { type: String }, // Add mediaUrl field for media messages
            mediaType: { type: String } // Add mediaType field to specify type of media (image, video)
        }
    ],
});

module.exports = mongoose.model('Chat', ChatSchema);
