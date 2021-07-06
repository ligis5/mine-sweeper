const newGame = document.getElementById("new-game");
const page = document.getElementById("page");

const columns = 30;
const rows = 16;

const amountOfPieces = rows * columns;

const pieceDiv = document.createElement("div");
pieceDiv.setAttribute("class", "piece");

const createPieces = () => {
  const board = document.createElement("div");
  board.setAttribute("class", "board");
  board.setAttribute("id", "board");
  page.appendChild(board);
  for (i = 1; i < amountOfPieces + 1; i++) {
    pieceDiv.setAttribute("id", i - 1);
    board.appendChild(pieceDiv.cloneNode(true));
  }
};
let pieces = document.querySelectorAll(".piece");

//created explosion <img/> to be added on pieces.
const img = document.createElement("img");
img.setAttribute("height", "18");
img.setAttribute("width", "18");
img.setAttribute("alt", "explosion");
img.setAttribute("class", "explosion");
img.src = "./explosion.png";

const placePiecesAndShuffle = () => {
  const pieces = document.querySelectorAll(".piece");

  // counts how many pieces there is and add id of each.
  let unshuffled = [];
  for (i = -1; i < amountOfPieces; i++) {
    unshuffled.push(i);
  }
  //randomizes numbers in array
  const shuffled = unshuffled
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);

  const placeCorrectPieces = () => {
    // i starts after all bomb pieces id's.
    for (i = Math.round(shuffled.length / 5); i < shuffled.length; i++) {
      const correctId = shuffled[i];

      if (pieces[correctId]) {
        let number = Number(pieces[correctId].id) + 1;
        const PiecePostionRow = Math.ceil(number / columns);
        const PiecePostionColumn =
          columns - (PiecePostionRow * columns - number);
        pieces[correctId].setAttribute("column", PiecePostionColumn);
        pieces[correctId].setAttribute("row", PiecePostionRow);
        pieces[correctId].addEventListener("click", () =>
          clickedCorrect(correctId, pieces)
        );
      }
    }
  };
  placeCorrectPieces();

  const placeBombs = () => {
    let bombs = [];
    for (o = -1; o < shuffled.length / 5; o++) {
      let bombId = shuffled[o];
      if (pieces[bombId]) {
        let number = Number(pieces[bombId].id) + 1;
        const PiecePostionRow = Math.ceil(number / columns);
        const PiecePostionColumn =
          columns - (PiecePostionRow * columns - number);
        pieces[bombId].setAttribute("column", PiecePostionColumn);
        pieces[bombId].setAttribute("row", PiecePostionRow);
        bombNeighbors("create", PiecePostionRow, PiecePostionColumn);
        pieces[bombId].setAttribute("bomb", true);
        img.setAttribute("id", "explosion" + bombId);
        pieces[bombId].appendChild(img.cloneNode(true));
        bombs.push(bombId);
        pieces[bombId].addEventListener("click", () =>
          clickedBomb(pieces[bombId], bombs, pieces)
        );
      }
    }
  };
  placeBombs();
};

const bombNeighbors = (whatToDo, row, column) => {
  let upColumn = Number(column) + 1;
  let downColumn = Number(column) - 1;
  let upRow = Number(row) + 1;
  let downRow = Number(row) - 1;

  let pieces = document.querySelectorAll(`
     [row = '${row}'][column = '${upColumn}'],
     [row = '${row}'][column = '${downColumn}'],
     [row = '${downRow}'][column = '${column}'],
     [row = '${upRow}'][column = '${column}'],
      [row = '${downRow}'][column = '${downColumn}'],
      [row = '${downRow}'][column = '${upColumn}'],
      [row = '${upRow}'][column = '${upColumn}'],
      [row = '${upRow}'][column = '${downColumn}']`);

  // this is run on page load. And after delete is ran.
  if (whatToDo === "create") {
    pieces.forEach((p) => {
      let bombsAround = p.getAttribute("bombsAround")
        ? p.getAttribute("bombsAround")
        : 1;
      if (!p.getAttribute("bomb")) {
        if (p.getAttribute("bombsAround")) {
          bombsAround++;
        }
        p.setAttribute("bombsAround", bombsAround);
      }
    });
  }
  // when first click is done if that piece is bomb this is ran
  // bombs around count is deleted and then counted and added again.
  if (whatToDo === "delete") {
    pieces.forEach((p) => {
      let bombsAround = p.getAttribute("bombsAround")
        ? p.getAttribute("bombsAround")
        : 0;
      if (p.getAttribute("bombsAround")) {
        bombsAround--;
        p.setAttribute("bombsAround", bombsAround);
      }
      if (bombsAround <= 0) {
        p.removeAttribute("bombsAround");
      }
      if (p.getAttribute("bomb")) {
        let newRow = p.getAttribute("row");
        let newColumn = p.getAttribute("column");
        bombNeighbors("create", newRow, newColumn);
      }
    });
  }
};

let explosion = false;
let gameStart = false;

// if clicked on any bomb, all bombs will show up.
// on first click when gameStart is false it will delete bomb and make it correct piece.
const clickedBomb = (piece, bombsIds, pieces) => {
  bombsIds.forEach((id) => {
    let piece = document.getElementById("explosion" + id);
    if (piece && gameStart) {
      piece.style.display = "inline";
      explosion = true;
    }
  });

  if (!gameStart) {
    piece.removeAttribute("bomb");
    piece.setAttribute("class", "open");
    const deleteFirstBomb = document.getElementById("explosion" + piece.id);
    deleteFirstBomb.remove();

    let row = piece.getAttribute("row");
    let column = piece.getAttribute("column");

    bombNeighbors("delete", row, column);
    clickedCorrect(piece.id, pieces);
  }
};

const openUntillBomb = (row, column) => {
  let upColumn = column + 1;
  let downColumn = column - 1;
  let upRow = row + 1;
  let downRow = row - 1;
  let pieces = document.querySelectorAll(`
     [row = '${row}'][column = '${upColumn}'],
     [row = '${row}'][column = '${downColumn}'],
     [row = '${downRow}'][column = '${column}'],
     [row = '${upRow}'][column = '${column}'],
      [row = '${downRow}'][column = '${downColumn}'],
      [row = '${downRow}'][column = '${upColumn}'],
      [row = '${upRow}'][column = '${upColumn}'],
      [row = '${upRow}'][column = '${downColumn}']`);

  pieces.forEach((p) => {
    if (!p || p.getAttribute("class") === "open" || p.getAttribute("bomb")) {
      return;
    }
    if (p.getAttribute("bombsaround")) {
      p.innerHTML = p.getAttribute("bombsaround");
      p.setAttribute("class", "open");
      return;
    }

    p.setAttribute("class", "open");
    let newRow = p.getAttribute("row");
    let newCol = p.getAttribute("column");
    openUntillBomb(Number(newRow), Number(newCol));
  });
};

const clickedCorrect = (correctId, pieces) => {
  gameStart = true;
  if (!explosion) {
    let row = pieces[correctId].getAttribute("row");
    let column = pieces[correctId].getAttribute("column");
    pieces[correctId].setAttribute("class", "open");
    if (pieces[correctId].getAttribute("bombsaround")) {
      pieces[correctId].innerHTML =
        pieces[correctId].getAttribute("bombsaround");
      return;
    }
    openUntillBomb(Number(row), Number(column));
  } else return;
};

const deleteOldGame = () => {
  document.getElementById("board").remove();
  explosion = false;
};

document.addEventListener("DOMContentLoaded", () => {
  createPieces();
  placePiecesAndShuffle();
});
newGame.addEventListener("click", () => {
  deleteOldGame();
  createPieces();
  placePiecesAndShuffle();
  gameStart = false;
});
