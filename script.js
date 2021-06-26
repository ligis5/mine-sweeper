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
    pieceDiv.setAttribute("id", i);
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

let explosion = false;
// if clicked on any bomb, all bombs will show up.
const clickedBomb = (pieces, shuffled) => {
  if (!explosion) {
    for (o = 0; o < shuffled.length / 5 - 1; o++) {
      let bombId = shuffled[o];
      if (pieces[bombId]) {
        pieces[bombId].children[0].style.display = "inline";
        explosion = true;
      }
    }
  } else return;
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

const shuffleAndAddBombs = () => {
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

  // for every second piece in the board bomb will be added.
  // pieces.id are random.

  // correct pieces

  const placeCorrectPieces = () => {
    for (i = Math.round(shuffled.length / 5); i < shuffled.length; i++) {
      const correctId = shuffled[i];

      if (pieces[correctId]) {
        const PiecePostionRow = Math.ceil(pieces[correctId].id / columns);
        const PiecePostionColumn =
          columns - (PiecePostionRow * columns - pieces[correctId].id);
        pieces[correctId].setAttribute("column", PiecePostionColumn);
        pieces[correctId].setAttribute("row", PiecePostionRow);
        pieces[correctId].addEventListener("click", () =>
          clickedCorrect(correctId, pieces)
        );
      }
    }
  };
  placeCorrectPieces();

  const bombNeighbors = (row, column) => {
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
  };

  const placeBombs = () => {
    for (o = 0; o < shuffled.length / 5 - 1; o++) {
      let bombId = shuffled[o];
      if (pieces[bombId]) {
        const PiecePostionRow = Math.ceil(pieces[bombId].id / columns);
        const PiecePostionColumn =
          columns - (PiecePostionRow * columns - pieces[bombId].id);
        pieces[bombId].setAttribute("column", PiecePostionColumn);
        pieces[bombId].setAttribute("row", PiecePostionRow);
        bombNeighbors(PiecePostionRow, PiecePostionColumn);
        pieces[bombId].setAttribute("bomb", true);
        img.setAttribute("id", "explosion" + bombId);
        pieces[bombId].appendChild(img.cloneNode(true));
        pieces[bombId].addEventListener("click", () =>
          clickedBomb(pieces, shuffled)
        );
      }
    }
  };
  placeBombs();
};

const deleteOldGame = () => {
  document.getElementById("board").remove();
  explosion = false;
};

document.addEventListener("DOMContentLoaded", () => {
  createPieces();
  shuffleAndAddBombs();
});
newGame.addEventListener("click", () => {
  deleteOldGame();
  createPieces();
  shuffleAndAddBombs();
});
