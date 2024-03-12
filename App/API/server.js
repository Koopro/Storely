require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/UserProfile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', userProfileRoutes);

app.post('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
