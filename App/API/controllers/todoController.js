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

exports.todospost = async (req, res) => {
    const { name, description, dueDate, dueTime, urgent, completed } = req.body;
    const userId = req.userData.userId; // Angenommen, req.userData wird von der Authentifizierungsmiddleware befüllt
    const listId = req.body.list; // Annahme: `selectedListId` wird im Anfragekörper gesendet

    if (!name) {
        return res.status(400).send({ message: 'Name is required' });
    }

    const newTodo = new Todo({
        name,
        description,
        dueDate,
        dueTime,
        urgent,
        completed,
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


exports.todosget = async (req, res) => {
    const userId = req.userData.userId; // Ensure user is authenticated
    const listId = req.query.list; // listId aus query parameter

    try {
        const todos = await Todo.find({ user: userId, list: listId });
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};

exports.todosput = async (req, res) => {
    const userId = req.userData.userId; // Ensure user is authenticated
    console.log("User ID:", userId);
    const todoId = req.params.id;

    try {
        const todo = await Todo.findOneAndUpdate({ _id: todoId, user: userId }, req.body, { new: true });
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found or you do not have permission to update it' });
        }
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
};
