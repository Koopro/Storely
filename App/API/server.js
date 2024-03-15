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

// Use the second MongoDB URI directly
const uri2 = process.env.MONGO_URI2;

// Function to create a new MongoClient using uri2
function createMongoClient(uri) {
  return new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
  });
}

// Initial MongoClient using uri2
let client = createMongoClient(uri2);

async function runMongoClient(client) {
  try {
    await client.connect();
    await client.db("storely").command({ ping: 1 });
    console.log("Connected successfully to MongoDB using MongoClient with uri2");
  } catch (err) {
    console.error("Could not connect to MongoDB using MongoClient with uri2", err);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userProfileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection using Mongoose with uri2
mongoose.connect(uri2, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB using Mongoose with uri2');
    runMongoClient(client); // Run MongoClient connection using uri2
  })
  .catch(err => console.error('Could not connect to MongoDB using Mongoose with uri2', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
