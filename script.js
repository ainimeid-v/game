let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timer = 0;
let interval = null;
let currentLevel = null;
let totalPairs = 0;

function startGame(level) {
    currentLevel = levels[level];
    totalPairs = currentLevel.pairs;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    score = 0;
    timer = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timer;

    clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        document.getElementById("timer").textContent = timer;
    }, 1000);

    createBoard();
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${currentLevel.columns}, 1fr)`;

    const selected = emojis
        .sort(() => 0.5 - Math.random())
        .slice(0, currentLevel.pairs);

    const gameItems = [...selected, ...selected]
        .sort(() => 0.5 - Math.random());

    gameItems.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.innerHTML = "❓";
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;

    this.classList.add("flipped");
    this.innerHTML = this.dataset.emoji;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

function checkMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        score++;
        document.getElementById("score").textContent = score;
        playMatchSound();
        resetTurn();

        if (score === totalPairs) {
            endGame();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerHTML = "❓";
            secondCard.innerHTML = "❓";
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function endGame() {
    clearInterval(interval);
    playWinSound();

    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("finalMessage").textContent =
        `Skor: ${score} | Waktu: ${timer} detik. Luar biasa! 🎉`;
}

function goToMenu() {
    clearInterval(interval);
    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}
