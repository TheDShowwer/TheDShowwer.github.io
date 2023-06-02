const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/player', async (req, res) => {
  try {
    const bungieName = req.body.bungieName;
    const apiKey = process.env.BUNGIE_API_KEY;
    const searchUrl = 'https://www.bungie.net/Platform/User/SearchUsers/';
    const searchParams = {
      search: bungieName
    };

    const response = await axios.post(searchUrl, searchParams, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Assuming the first profile in the response is the desired player
    const playerProfile = response.data.Response[0];

    // Get the Destiny membership ID and membership type
    const destinyMembershipId = playerProfile.membershipId;
    const membershipType = playerProfile.membershipType;

    res.json({
      destinyMembershipId,
      membershipType
    });
  } catch (error) {
    console.log('Error:', error.response.data);
    res.status(500).json({ error: 'Failed to retrieve player membership ID' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


