const Chat = require('../models/Chat');

exports.saveMessage = async (messageData) => {
    try {
        const newMessage = new Chat(messageData);
        await newMessage.save();
        return newMessage;
    } catch (error) {
        throw new Error('Error saving message: ' + error.message);
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const chatHistory = await Chat.find({ conversationId }).sort({ timestamp: 1 }).populate('sender recipient');
        res.status(200).json(chatHistory);
    } catch (error) {
        res.status(500).send('Error retrieving chat history');
    }
};
