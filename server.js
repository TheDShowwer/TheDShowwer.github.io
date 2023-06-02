const express = require('express');
const path = require('path');
require('dotenv').config();
require('isomorphic-fetch');

const app = express();
const apiKey = process.env.API_KEY;
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/player/:platform/:name', async (req, res) => {
  const platform = req.params.platform;
  const name = req.params.name;

  try {
    // Fetch player data using Bungie API
    const response = await fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${platform}/${name}/`, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    const data = await response.json();

    if (data.Response && data.Response.length > 0) {
      const membershipId = data.Response[0].membershipId;
      const destinyMembershipId = data.Response[0].membershipId;

      // Fetch player profile data using membershipId and destinyMembershipId
      const profileResponse = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershipId}/Profile/${destinyMembershipId}/?components=100`, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      const profileData = await profileResponse.json();

      if (profileData.Response) {
        const profile = profileData.Response.profile.data;

        // Extract necessary data from the profile
        const emblem = profile.emblemPath;
        const classType = profile.classType;
        const race = profile.raceType;
        const lightLevel = profile.light;

        // Return the player data as JSON
        res.json({ emblem, classType, race, lightLevel });
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
