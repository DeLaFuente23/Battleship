const playerOneInput = document.getElementById("player-one");
const playerTwoInput = document.getElementById("player-two");
const linksList = document.getElementById("links");
const scrollCue = document.getElementById("scroll-cue");
const generateButton = document.getElementById("generate-btn");
const clearButton = document.getElementById("clear-btn");

function renderEmptyState() {
  linksList.innerHTML = '<li class="empty-state">The two player cards will appear here after you generate the game.</li>';
}

function buildPlayerUrl(base, playerName, opponentName, playerNumber) {
  return `${base}player.html?name=${encodeURIComponent(playerName)}&opponent=${encodeURIComponent(opponentName)}&player=${playerNumber}`;
}

function renderCards(players) {
  linksList.innerHTML = "";

  const base = window.location.origin + window.location.pathname.replace("index.html", "");

  players.forEach((player, index) => {
    const url = buildPlayerUrl(base, player.name, player.opponent, index + 1);

    const qr = document.createElement("img");
    qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(url)}`;
    qr.alt = `QR code for ${player.name}`;
    qr.loading = "lazy";

    const qrFrame = document.createElement("div");
    qrFrame.className = "qr-frame";
    qrFrame.appendChild(qr);

    const link = document.createElement("a");
    link.href = url;
    link.innerText = player.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const badge = document.createElement("div");
    badge.className = "player-badge";
    badge.innerText = `Player ${index + 1}`;

    const note = document.createElement("p");
    note.className = "link-note";
    note.innerText = `Private page for ${player.name}. Only ${player.name} should open this one.`;

    const card = document.createElement("li");
    card.className = "player-card";
    card.appendChild(badge);
    card.appendChild(link);
    card.appendChild(note);
    card.appendChild(qrFrame);

    linksList.appendChild(card);
  });
}

function startGame() {
  const playerOne = playerOneInput.value.trim();
  const playerTwo = playerTwoInput.value.trim();

  if (!playerOne || !playerTwo) {
    alert("Please enter the two player names.");
    return;
  }

  const normalizedOne = playerOne.toLowerCase();
  const normalizedTwo = playerTwo.toLowerCase();

  if (normalizedOne === normalizedTwo) {
    alert("Please use two different player names.");
    return;
  }

  renderCards([
    { name: playerOne, opponent: playerTwo },
    { name: playerTwo, opponent: playerOne }
  ]);

  scrollCue.classList.add("visible");
}

function resetGame() {
  playerOneInput.value = "";
  playerTwoInput.value = "";
  scrollCue.classList.remove("visible");
  renderEmptyState();
  playerOneInput.focus();
}

function scrollToResults() {
  document.getElementById("results").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

generateButton.addEventListener("click", startGame);
clearButton.addEventListener("click", resetGame);
scrollCue.addEventListener("click", scrollToResults);

[playerOneInput, playerTwoInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      startGame();
    }
  });
});

renderEmptyState();
