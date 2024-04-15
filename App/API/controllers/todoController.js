const List = require('../models/List');
const cors = require('cors');

exports.listspost = async (req, res) => {
    const { name, password, color } = req.body;
    const userId = req.userData.user._id; // Assuming `req.user` is populated from your authentication middleware

    if (!name || !password) {
        return res.status(400).send({ message: 'Name and password are required' });
    }

    const newList = new List({
        name,
        password,
        color,
        user: userId
    });

    try {
        await newList.save();
        res.status(201).send(newList);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
exports.listsget = async (req, res) => {
    const userId = req.userData.user._id; // Ensure user is authenticated

    try {
        const lists = await List.find({ user: userId });
        res.status(200).send(lists);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};

exports.listid = async (req, res) => {
    const userId = req.userData.user._id; // Ensure user is authenticated
    const listId = req.params.id;

    try {
        const list = await List.findOneAndDelete({ _id: listId, user: userId });
        if (!list) {
            return res.status(404).send({ message: 'List not found or you do not have permission to delete it' });
        }
        res.status(200).send({ message: 'List successfully deleted' });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send(error);
    }
};
