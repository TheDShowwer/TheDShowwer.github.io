const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/characters', (req, res) => {
  const { destinyMembershipId, platform } = req.query;
  const apiKey = process.env.BUNGIE_API_KEY;
  const url = `https://www.bungie.net/Platform/Destiny2/${platform}/Profile/${destinyMembershipId}/?components=100,200`;

  axios.get(url, { headers: { 'X-API-Key': apiKey } })
    .then(response => {
      res.send(response.data.Response.characters.data);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('An error occurred while retrieving the character data.');
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
