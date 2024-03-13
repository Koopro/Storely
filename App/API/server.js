require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/UserProfile');
// Import MongoClient
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URI from environment variables
const uri = process.env.MONGO_URI;

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function runMongoClient() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB using MongoClient");
  } catch (err) {
    console.error("Could not connect to MongoDB using MongoClient", err);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userProfileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB using Mongoose');
    runMongoClient(); // Run MongoClient connection
  })
  .catch(err => console.error('Could not connect to MongoDB using Mongoose', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
