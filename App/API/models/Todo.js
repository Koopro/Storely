const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
