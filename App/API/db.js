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
  
  async function run() {
    try {
      await client.connect();
      await client.db("storely").command({ ping: 1 });
      console.log("Connected successfully to MongoDB using MongoClient");
    } catch (err) {
      console.error("Could not connect to MongoDB using MongoClient", err);
    }
  }
  
  run().catch(console.dir);
};

module.exports = { dbConnectMongoose, dbConnectMongoClient };
