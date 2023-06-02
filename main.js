document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-button');
  const playerNameInput = document.getElementById('playerName');
  const platformSelect = document.getElementById('platform');
  const resultsContainer = document.getElementById('results');

  searchButton.addEventListener('click', async () => {
    const platform = platformSelect.value;
    const playerName = playerNameInput.value;

    if (playerName.trim() === '') {
      alert('Please enter a valid player name');
      return;
    }

    try {
      const response = await fetch(`/api/player/${platform}/${playerName}`);
      const data = await response.json();

      if (response.ok) {
        displayPlayerData(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching player data');
    }
  });

  async function displayPlayerData(data) {
    const { emblem, classType, race, lightLevel, filteredItems } = data;

    const html = `
      <div class="player-data">
        <img src="${emblem}" alt="Player Emblem" width="100">
        <p><strong>Name:</strong> ${playerNameInput.value}</p>
        <p><strong>Class:</strong> ${classType}</p>
        <p><strong>Race:</strong> ${race}</p>
        <p><strong>Light Level:</strong> ${lightLevel}</p>
      </div>
      <h2>Most Used Weapons/Armor:</h2>
      <div class="filtered-items">
        ${await fetchFilteredItemsHtml(filteredItems)}
      </div>
    `;

    resultsContainer.innerHTML = html;
  }

  async function fetchFilteredItemsHtml(filteredItems) {
    let html = '';

    for (const item of filteredItems) {
      const itemResponse = await fetch(`https://www.bungie.net${item.itemPath}`);
      const itemData = await itemResponse.json();

      html += `
        <div class="item">
          <img src="${itemData.icon}" alt="Item Icon" width="50">
          <p>${itemData.name}</p>
        </div>
      `;
    }

    return html;
  }
});

     
