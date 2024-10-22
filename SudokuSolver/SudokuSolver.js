document.addEventListener("DOMContentLoaded", () => {
  const sudokuBoard = document.getElementById("sudoku-board");
  const generateBtn = document.getElementById("generate-btn");
  const solveBtn = document.getElementById("solve-btn");
  const clearBtn = document.getElementById("clear-btn");

  let currentSudoku;
  let solving = false;

  const sudokuPuzzles = [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    [
      [0, 2, 0, 6, 0, 8, 0, 0, 0],
      [5, 8, 0, 0, 0, 9, 7, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [3, 7, 0, 0, 0, 0, 5, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 8, 0, 0, 0, 0, 1, 3],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 9, 8, 0, 0, 0, 3, 6],
      [0, 0, 0, 3, 0, 6, 0, 9, 0],
    ],
    [
      [0, 0, 4, 0, 5, 0, 0, 0, 0],
      [9, 0, 0, 7, 3, 4, 6, 0, 0],
      [0, 0, 3, 0, 2, 1, 0, 4, 9],
      [0, 3, 5, 0, 9, 0, 4, 8, 0],
      [0, 9, 0, 0, 0, 0, 0, 3, 0],
      [0, 7, 6, 0, 1, 0, 9, 2, 0],
      [3, 1, 0, 9, 7, 0, 2, 0, 0],
      [0, 0, 9, 1, 8, 2, 0, 0, 3],
      [0, 0, 0, 0, 6, 0, 1, 0, 0],
    ],
  ];

  const emptySudoku = Array.from({ length: 9 }, () => Array(9).fill(0));

  function fillBoard(sudoku) {
    sudokuBoard.innerHTML = "";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (sudoku[row][col] !== 0) {
          cell.innerHTML = `<span>${sudoku[row][col]}</span>`;
        }
        sudokuBoard.appendChild(cell);
      }
    }
  }

  async function solveSudoku(sudoku) {
    const emptyPos = findEmpty(sudoku);
    if (!emptyPos || !solving) {
      return true;
    }
    const [row, col] = emptyPos;

    for (let num = 1; num <= 9; num++) {
      if (isValid(sudoku, num, row, col)) {
        sudoku[row][col] = num;
        highlightCell(row, col, num);
        await delay();

        if (await solveSudoku(sudoku)) {
          return true;
        }

        sudoku[row][col] = 0;
        highlightCell(row, col, "");
        await delay();
      }
    }
    return false;
  }

  function highlightCell(row, col, num) {
    const index = row * 9 + col;
    const cell = sudokuBoard.children[index];
    cell.innerHTML = `<span>${num}</span>`;
    cell.classList.add(num === "" ? "highlight" : "solved");
  }

  function clearBoard() {
    solving = false;
    currentSudoku = JSON.parse(JSON.stringify(emptySudoku));
    fillBoard(currentSudoku);
    sudokuBoard.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("highlight", "solved");
    });
  }

  function findEmpty(sudoku) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (sudoku[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  function isValid(sudoku, num, row, col) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (sudoku[row][x] === num) {
        return false;
      }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (sudoku[x][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (sudoku[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  function delay(ms = 1) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  generateBtn.addEventListener("click", () => {
    solving = false;
    currentSudoku = JSON.parse(JSON.stringify(sudokuPuzzles[Math.floor(Math.random() * sudokuPuzzles.length)]));
    fillBoard(currentSudoku);
  });

  solveBtn.addEventListener("click", async () => {
    if (currentSudoku) {
      solving = true;
      await solveSudoku(currentSudoku);
      solving = false;
    } else {
      alert("Please generate a Sudoku puzzle first.");
    }
  });

  clearBtn.addEventListener("click", clearBoard);

  clearBoard();
});
