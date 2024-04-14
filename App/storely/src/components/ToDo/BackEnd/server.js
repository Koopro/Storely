const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const List = require('./models/List'); // Pfad anpassen, falls nötig

const app = express();
app.use(express.json());
app.use(cors()); // CORS ermöglichen für alle Domains

mongoose.connect('mongodb://localhost:27017/Storely', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/lists', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: 'Name is required' });
    }
    const newList = new List({ name });
    await newList.save();
    res.status(201).send(newList);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});


app.get('/lists', async (req, res) => {
  const lists = await List.find();
  res.status(200).send(lists);
});

// server.js

app.delete('/lists/:id', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});