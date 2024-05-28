const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get chat messages by chatId
router.get('/chats/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
        console.log(`Fetching chat with ID: ${chatId}`);
        const chat = await Chat.findOne({ chatId });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
