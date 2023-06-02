const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Bungie API key
const apiKey = process.env.BUNGIE_API_KEY;

// Endpoint to retrieve player information
app.get('/player/:bungieName', async (req, res) => {
  try {
    const bungieName = req.params.bungieName;
    
    // Get Destiny Membership ID
    const membershipIdResponse = await axios.get(
      `https://www.bungie.net/Platform/User/SearchUsers?q=${bungieName}`,
      {
        headers: {
          'X-API-Key': apiKey
        }
      }
    );
    
    const destinyMembershipId = membershipIdResponse.data.Response[0].membershipId;
    const membershipType = membershipIdResponse.data.Response[0].membershipType;
    
    // Get Player Profile
    const profileResponse = await axios.get(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/`,
      {
        headers: {
          'X-API-Key': apiKey
        }
      }
    );
    
    const characterIds = profileResponse.data.Response.profile.data.characterIds;
    
    // Get Character Information
    const characterInfoResponse = await axios.get(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/Character/${characterIds[0]}/`,
      {
        headers: {
          'X-API-Key': apiKey
        }
      }
    );
    
    const characterData = characterInfoResponse.data.Response.character.data;
    const emblemPath = characterData.emblemPath;
    const light = characterData.light;
    const race = characterData.raceType;
    const playerClass = characterData.classType;
    
    // Get Most Used Guns
    const mostUsedGunsResponse = await axios.get(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterIds[0]}/Stats/Weapons/`,
      {
        headers: {
          'X-API-Key': apiKey
        }
      }
    );
    
    const mostUsedGuns = mostUsedGunsResponse.data.Response.mergedAllCharacters.results
      .filter(result => result.values.uniqueWeaponKills.basic.value > 0)
      .map(result => ({
        name: result.weaponName,
        kills: result.values.uniqueWeaponKills.basic.value
      }));
    
    // Get Most Used Armor with Rarity Filter
    const mostUsedArmorResponse = await axios.get(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterIds[0]}/Stats/AggregateActivityStats/`,
      {
        headers: {
          'X-API-Key': apiKey
        }
      }
    );
    
    const mostUsedArmor = mostUsedArmorResponse.data.Response.activities
      .filter(activity => activity.values.uniqueWeaponKills.basic.value > 0 && activity.values.uniqueWeaponKills.basic.displayValue.includes('Rare'))
      .map(activity => ({
        name: activity.activityDetails.referenceId,
        kills: activity.values.uniqueWeaponKills.basic.value
      }));
    
    const playerInfo = {
      emblemPath,
      light,
      race,
      playerClass,
      mostUsedGuns,
      mostUsedArmor
    };
    
    res.json(playerInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


