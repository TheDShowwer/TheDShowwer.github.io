function searchPlayer() {
  const playerName = document.getElementById('playerName').value;

  fetch(`/player/${playerName}`)
    .then(response => response.json())
    .then(data => {
      const playerInfo = document.getElementById('playerInfo');
      playerInfo.innerHTML = `
        <h2>${data.displayName}</h2>
        <img src="${data.emblem}" alt="Player Emblem">
        <p>Light Level: ${data.lightLevel}</p>
        <p>Class: ${data.class}</p>
      `;
    })
    .catch(error => console.error(error));
}
