const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8vqvwys.mongodb.net/knotDb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db();

    // Define your collections
    const usersCollection = db.collection("users");
    const menuCollection = db.collection("menu");
    const reviewCollection = db.collection("reviews");
    const cartCollection = db.collection("carts");

    // REST API routes

    // Create a new user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const result = await usersCollection.insertOne(user);
      res.status(201).json(result.ops[0]);
    });

    // Retrieve all users
    app.get('/users', async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.json(users);
    });

    // Define other routes for menu, reviews, and carts as needed

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.error);