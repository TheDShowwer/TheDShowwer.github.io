const express = require('express');
const path = require('path');
require('dotenv').config();
require('isomorphic-fetch');

const app = express();
const apiKey = process.env.API_KEY;
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the Destiny 2 Usage Tracker!');
});

app.get('/api/player/:platform/:name', async (req, res) => {
  // Your existing code for handling the /api/player/:platform/:name route goes here
  // ...

  // Example response for testing
  res.json({ message: 'Player data' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
