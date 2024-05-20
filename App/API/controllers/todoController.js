const List = require('../models/List');
const User = require('../models/User');
const Todo = require('../models/Todo');
const cors = require('cors');

exports.listspost = async (req, res) => {
    const { name, color } = req.body;
    const userId = req.userData.userId; // Assuming `req.user` is populated from your authentication middleware

    if (!name) {
        return res.status(400).send({ message: 'Name are required' });
    }

    const newList = new List({
        name,
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
    const userId = req.userData.userId; // Ensure user is authenticated

    try {
        const lists = await List.find({ user: userId });
        res.status(200).send(lists);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};

exports.listid = async (req, res) => {
    const userId = req.userData.userId; // Correct access based on your middleware
    // Ensure user is authenticated
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

exports.createTodo = async (req, res) => {
    const { name, description, dueDate, dueTime, urgent, listId } = req.body;
    const userId = req.userData.userId;

    if (!name || !listId) {
        return res.status(400).send({ message: 'Name and List ID are required' });
    }

    const newTodo = new Todo({
        name,
        description,
        dueDate,
        dueTime,
        urgent,
        completed: false,
        list: listId,
        user: userId
    });

    try {
        await newTodo.save();
        res.status(201).send(newTodo);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};

exports.getTodosByList = async (req, res) => {
    const { listId } = req.params;
    const userId = req.userData.userId;

    try {
        const todos = await Todo.find({ list: listId, user: userId });
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
