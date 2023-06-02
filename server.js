const express = require('express');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to the Destiny 2 Usage Tracker!');
});

app.get('/api/player/:platform/:name', async (req, res) => {
  const platform = req.params.platform;
  const name = req.params.name;
  const apiKey = process.env.API_KEY;

  try {
    // Fetch player data using Bungie API
    const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${platform}/${name}/`, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    const data = response.data;

    if (data.Response && data.Response.length > 0) {
      const membershipId = data.Response[0].membershipId;
      const destinyMembershipId = data.Response[0].membershipId;

      // Fetch player profile data using membershipId and destinyMembershipId
      const profileResponse = await axios.get(`https://www.bungie.net/Platform/Destiny2/${membershipId}/Profile/${destinyMembershipId}/?components=100`, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      const profileData = profileResponse.data;

      if (profileData.Response) {
        const profile = profileData.Response.profile.data;

        // Extract necessary data from the profile
        const emblem = profile.emblemPath;
        const classType = profile.classType;
        const race = profile.raceType;
        const lightLevel = profile.light;

        // Fetch most used weapons/armor
        const itemsResponse = await axios.get(`https://www.bungie.net/Platform/Destiny2/${membershipId}/Profile/${destinyMembershipId}/?components=102`, {
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
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
