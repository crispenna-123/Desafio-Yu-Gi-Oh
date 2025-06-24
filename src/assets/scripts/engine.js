const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCars: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playersSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes white Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

// Função assíncrona para obter o ID do cartão aleatório
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

// Função assíncrona para criar a imagem do cartão
async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", cardId);
  cardImage.classList.add("card");

  if (fieldSide === state.playersSides.player1) {
    cardImage.addEventListener("mouseover", async () => {
      await drawSelectCards(cardId);
    });

    cardImage.addEventListener("click", async () => {
      await setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

// Função assíncrona para definir as cartas no campo de batalha
async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsAndFields(cardId, computerCardId);
  // chamada assíncrona para o resultado da disputa
  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawCardsAndFields(cardId, computerCardId) {
  state.fieldCars.player.src = cardData[cardId].img;
  state.fieldCars.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCars.player.style.display = "block";
    state.fieldCars.computer.style.display = "block";
  }

  if (value === false) {
    state.fieldCars.player.style.display = "none";
    state.fieldCars.computer.style.display = "none";
  }
}

async function hiddenCardDetails() {
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.cardSprites.avatar.src = "";
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Win";
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "Lose";
    state.score.computerScore++;
  }
  await playAudio(duelResults);

  return duelResults;
}

// Função assíncrona para remover todas as imagens das cartas
async function removeAllCardsImages() {
  const { computerBOX, player1BOX } = state.playersSides;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

// Função assíncrona para desenhar as cartas selecionadas
async function drawSelectCards(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// Função assíncrona para desenhar múltiplas cartas
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCars.player.style.display = "none";
  state.fieldCars.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  try {
    audio.play();
  } catch {}
}

// Função inicial que chama a criação das cartas
function init() {
  showHiddenCardFieldsImages(false);

  drawCards(5, state.playersSides.player1);
  drawCards(5, state.playersSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
