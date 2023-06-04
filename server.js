const express = require('express');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/player/:platform/:id', async (req, res) => {
  const platform = req.params.platform;
  const id = req.params.id;
  const apiKey = process.env.BUNGIE_API_KEY;

  try {
    // Fetch player data using Bungie API
    const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${id}/?components=100`, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    const data = response.data;

    if (data.Response) {
      const profile = data.Response.profile.data;

      // Extract necessary data from the profile
      const emblem = profile.emblemPath;
      const classType = profile.classType;
      const race = profile.raceType;
      const lightLevel = profile.light;

      // Fetch most used weapons/armor
      const itemsResponse = await axios.get(`https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${id}/?components=102`, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      const itemsData = itemsResponse.data;

      if (itemsData.Response) {
        const items = itemsData.Response.profileInventory.data.items;

        // Filter items by rarity
        const rarityFilter = req.query.rarity; // Expects a query parameter named 'rarity'
        const filteredItems = items.filter(item => item.itemTypeAndTierDisplayName.toLowerCase().includes(rarityFilter));

        // Return the player data and filtered items as JSON
        res.json({ emblem, classType, race, lightLevel, filteredItems });
      } else {
        res.status(404).json({ error: 'Player items not found' });
      }
    } else {
      res.status(404).json({ error: 'Player profile not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Solution 2: Custom error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Solution 3: 404 error handler middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



