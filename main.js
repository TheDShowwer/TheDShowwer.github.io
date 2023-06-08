function searchCharacters() {
  const destinyMembershipId = document.getElementById('destinyMembershipIdInput').value;
  const platform = document.getElementById('platformInput').value;

  axios.get(`/characters?destinyMembershipId=${destinyMembershipId}&platform=${platform}`)
    .then(response => {
      displayCharacters(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayCharacters(characters) {
  const charactersContainer = document.getElementById('charactersContainer');
  charactersContainer.innerHTML = '';

  characters.forEach(character => {
    const characterElement = document.createElement('div');
    characterElement.innerHTML = `
      <h2>${character.displayName}</h2>
      <img src="https://www.bungie.net${character.emblemPath}" alt="Character Emblem">
      <p>Light Level: ${character.light}</p>
      <p>Race: ${character.raceType}</p>
      <p>Class: ${character.classType}</p>
      <p>Gender: ${character.genderType}</p>
    `;

    charactersContainer.appendChild(characterElement);
  });
}
