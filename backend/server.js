require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./user.routes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
console.log('mongoUri', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
