const List = require('../models/List');
const cors = require('cors');

exports.listspost = async (req, res) => {
    try {
        const { name, password, color } = req.body;
        if (!name || !password) {
            return res.status(400).send({ message: 'Name and password are required' });
        }
        const newList = new List({ name, password, color });
        await newList.save();
        res.status(201).send(newList);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};



exports.listsget = async (req, res) => {
    const lists = await List.find();
    res.status(200).send(lists);
};

// server.js

exports.listid = async (req, res) => {
    console.log("Trying to delete ID:", req.params.id); // Ensure this logs the correct ID
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        if (!list) {
            return res.status(404).send({ message: 'List not found' });
        }
        res.status(200).send({ message: 'List successfully deleted' });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send(error);
    }
};