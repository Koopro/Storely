/* This JavaScript code snippet is setting up database connections to MongoDB using both Mongoose and
the MongoDB Node.js driver. Here's a breakdown of what the code is doing: */
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri2 = process.env.MONGO_URI;

const dbConnectMongoose = () => {
  mongoose.connect(uri2, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB using Mongoose'))
    .catch(err => console.error('Could not connect to MongoDB using Mongoose', err));
};

const dbConnectMongoClient = () => {
  const client = new MongoClient(uri2, { serverApi: ServerApiVersion.v1 });

  // Function to wrap text in ANSI color codes
  const colorize = (text, color) => {
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      reset: '\x1b[0m' // Resets the color
    };
    return `${colors[color]}${text}${colors.reset}`;
  };

  async function run() {
    try {
      await client.connect();
      console.log(colorize("Connected successfully to MongoDB using MongoClient", "green"));

      const db = client.db("storely");
      const collections = await db.listCollections().toArray();
      console.log(colorize("Collections:", "blue"));
      collections.forEach((collection) => {
        console.log(colorize(collection.name, "cyan"));
      });
    } catch (err) {
      console.error(colorize("Could not connect to MongoDB using MongoClient", "red"), err);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
};


module.exports = { dbConnectMongoose, dbConnectMongoClient };