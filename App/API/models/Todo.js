const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date
  },
  dueTime: {
    type: String
  },
  urgent: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
