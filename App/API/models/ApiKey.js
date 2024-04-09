const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false, // Make expiration optional
  },
},
{
  collection: 'apikeys',
}
);

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
