const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false // Dieses Feld ist optional.
  }
});

const List = mongoose.model('List', listSchema);

module.exports = List;
