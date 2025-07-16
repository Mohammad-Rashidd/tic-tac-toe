const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMove = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMove, reset };
})();

const Player = (name, marker) => ({ name, marker });

const DisplayController = (() => {
  const boardDiv = document.getElementById("game-board");
  const status = document.getElementById("status");

  const render = () => {
    boardDiv.innerHTML = "";

    Gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;

      if (cell === "X") cellDiv.classList.add("x");
      if (cell === "O") cellDiv.classList.add("o");

      cellDiv.addEventListener("click", () => {
        GameController.playRound(index);
      });

      boardDiv.appendChild(cellDiv);
    });
  };

  const setMessage = (msg) => {
    status.textContent = msg;
  };

  return { render, setMessage };
})();

const GameController = (() => {
  let player1, player2, currentPlayer, gameOver;

  const startGame = () => {
    const name1 = document.getElementById("player1-name").value || "Player 1";
    const name2 = document.getElementById("player2-name").value || "Player 2";
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
    gameOver = false;

    Gameboard.reset();
    DisplayController.render();
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);

    document.getElementById("game-container").style.display = "block";
    document.getElementById("player-setup").style.display = "none";
  };

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const playRound = (index) => {
    if (gameOver) return;
    if (!Gameboard.setMove(index, currentPlayer.marker)) return;

    DisplayController.render();

    if (checkWin(currentPlayer.marker)) {
      showModal(`${currentPlayer.name} wins! 🎉`);
      gameOver = true;
      return;
    }

    if (checkTie()) {
      showModal("It's a draw! 😐");
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const checkWin = (mark) => {
    return winningCombos.some((combo) =>
      combo.every((index) => Gameboard.getBoard()[index] === mark)
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const restartGame = () => {
    document.getElementById("player-setup").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("result-modal").style.display = "none";
  };

  return { startGame, playRound, restartGame };
})();

const resultModal = document.getElementById("result-modal");
const resultMessage = document.getElementById("result-message");
const closeModalBtn = document.getElementById("close-modal-btn");

closeModalBtn.addEventListener("click", () => {
  resultModal.style.display = "none";
});

function showModal(message) {
  resultMessage.textContent = message;
  resultModal.style.display = "flex";
}

document
  .getElementById("start-btn")
  .addEventListener("click", GameController.startGame);
document
  .getElementById("restart-btn")
  .addEventListener("click", GameController.restartGame);
