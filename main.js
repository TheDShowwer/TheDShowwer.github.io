const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const platformSelect = document.getElementById('platform-select');
const resultContainer = document.getElementById('result-container');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const playerName = searchInput.value.trim();
  const platform = platformSelect.value;

  if (!playerName) {
    return;
  }

  try {
    const response = await fetch(`/api/profile?playerName=${encodeURIComponent(playerName)}&platform=${platform}`);
    const data = await response.json();

    displayPlayerData(data);
  } catch (error) {
    console.error(error);
    displayErrorMessage('An error occurred while fetching player data.');
  }
});

function displayPlayerData(data) {
  resultContainer.innerHTML = '';

  // Display player information
  const playerInfo = document.createElement('div');
  playerInfo.innerHTML = `
    <h2>${data.displayName}</h2>
    <p>Platform: ${data.platform}</p>
    <p>Emblem: ${data.emblem}</p>
    <p>Class: ${data.class}</p>
    <p>Race: ${data.race}</p>
    <p>Light Level: ${data.lightLevel}</p>
  `;
  resultContainer.appendChild(playerInfo);

  // Display most used guns
  const gunsContainer = document.createElement('div');
  gunsContainer.classList.add('usage-container');
  gunsContainer.innerHTML = `
    <h3>Most Used Guns</h3>
    <div id="guns-filter" class="filter">
      <label for="gun-rarity">Rarity:</label>
      <select id="gun-rarity">
        <option value="">All</option>
        <option value="Exotic">Exotic</option>
        <option value="Legendary">Legendary</option>
        <option value="Rare">Rare</option>
        <option value="Common">Common</option>
      </select>
    </div>
    <div id="guns-list"></div>
  `;
  resultContainer.appendChild(gunsContainer);

  const gunsList = document.getElementById('guns-list');

  // Apply filter when the rarity selection changes
  const gunRaritySelect = document.getElementById('gun-rarity');
  gunRaritySelect.addEventListener('change', () => {
    const selectedRarity = gunRaritySelect.value;
    filterGunsByRarity(selectedRarity);
  });

  // Display all guns initially
  data.guns.forEach((gun) => {
    const gunElement = document.createElement('div');
    gunElement.classList.add('gun');
    gunElement.innerHTML = `
      <h4>${gun.name}</h4>
      <p>Rarity: ${gun.rarity}</p>
      <p>Kills: ${gun.kills}</p>
    `;
    gunsList.appendChild(gunElement);
  });

  function filterGunsByRarity(rarity) {
    const allGuns = Array.from(gunsList.getElementsByClassName('gun'));
    allGuns.forEach((gunElement) => {
      if (!rarity || gunElement.querySelector('p[data-rarity]').getAttribute('data-rarity') === rarity) {
        gunElement.style.display = 'block';
      } else {
        gunElement.style.display = 'none';
      }
    });
  }

  // Display most used armor
  const armorContainer = document.createElement('div');
  armorContainer.classList.add('usage-container');
  armorContainer.innerHTML = `
    <
     
