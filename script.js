//your JS code here. If required.
// Grab references to the inputs and buttons from the DOM
const name1Input = document.getElementById('player1'); // Player 1 name input
const name2Input = document.getElementById('player2'); // Player 2 name input
const submitBtn  = document.getElementById('submit');  // "Start Game" button


// Grab references to the game section and UI elements on the board page
const gameSection = document.querySelector('.game');    // The hidden game area
const messageEl   = document.querySelector('.message'); // Text area for turn/win messages
const cells       = document.querySelectorAll('.cell'); // All 9 cells of the board

// Initialize game state variables
let player1 = 'Player 1';       // Default name if input is empty
let player2 = 'Player 2';       // Default name if input is empty
let isXTurn = true;             // X always starts (Player 1)
let board   = Array(9).fill(''); // Board state: '', 'X', or 'O' for each of 9 cells
let gameOver = false;           // Prevents moves after win/draw

// Utility: all winning line indexes on a 3x3 board
const wins = [
  [0,1,2], [3,4,5], [6,7,8],   // rows
  [0,3,6], [1,4,7], [2,5,8],   // cols
  [0,4,8], [2,4,6]             // diagonals
]; // Each sub-array lists 3 indices that form a winning line

// Start game when the user clicks submit
submitBtn.addEventListener('click', () => {                     // Handle Start Game click
  player1 = (name1Input.value || '').trim() || 'Player 1';      // Read Player 1 name or fallback
  player2 = (name2Input.value || '').trim() || 'Player 2';      // Read Player 2 name or fallback

  resetBoard();                                                 // Ensure clean board at start
  document.querySelector('.player-inputs').style.display = 'none'; // Hide the inputs section
  gameSection.style.display = 'block';                          // Show the game section

  updateTurnMessage();                                          // Show "who's up" message
}); // End submit handler

// Attach click listeners to each cell (so users can play)
cells.forEach(cell => {                     // Iterate over all 9 cells
  cell.addEventListener('click', onCellClick); // Each cell uses the same click handler
}); // End cell listeners setup

// Handle a single cell click
function onCellClick(e) {                                // Fired when a cell is clicked
  if (gameOver) return;                                  // Ignore clicks after game over
  const cell = e.currentTarget;                          // The clicked cell element
  const index = parseInt(cell.id, 10) - 1;               // Convert cell id (1..9) -> index (0..8)
  if (board[index]) return;                              // If already filled, do nothing

  const mark = isXTurn ? 'x' : 'o';                      // Decide whether to place X or O
  board[index] = mark;                                   // Update the board state
  cell.textContent = mark;                               // Show the mark in the UI

  if (checkWin(mark)) {                                  // If current player just won
    const winnerName = isXTurn ? player1 : player2;      // Determine the winning player's name
    messageEl.textContent = `${winnerName} congratulations you won!`; // Show win message
    gameOver = true;                                     // Lock the board
    return;                                              // Stop further processing
  }

  if (isDraw()) {                                        // If all cells filled and no winner
    messageEl.textContent = `It's a draw!`;              // Show draw message (optional but helpful)
    gameOver = true;                                     // Lock the board
    return;                                              // Stop further processing
  }

  isXTurn = !isXTurn;                                    // Switch turns
  updateTurnMessage();                                   // Update "who's up" message
} // End onCellClick

// Check whether the given mark ('X' or 'O') has any winning line
function checkWin(mark) {                                // Returns true if mark has a 3-in-a-row
  return wins.some(([a, b, c]) =>                        // Check every winning combination
    board[a] === mark && board[b] === mark && board[c] === mark // All three positions match mark
  );                                                     // True if any combo matches
} // End checkWin

// Check for draw: true if every board cell is non-empty
function isDraw() {                                      // Returns true if the board is full
  return board.every(cell => cell !== '');               // No empty strings means draw
} // End isDraw

// Update the message to indicate whose turn it is
function updateTurnMessage() {                           // Shows "name, you're up"
  const name = isXTurn ? player1 : player2;              // Pick current player's name
  messageEl.textContent = `${name}, you're up`;          // Display turn message
} // End updateTurnMessage

// Reset the board visuals and state (used when starting)
function resetBoard() {                                  // Clears the board for a fresh game
  board = Array(9).fill('');                             // Reset data model
  gameOver = false;                                      // Allow moves again
  isXTurn = true;                                        // X starts
  cells.forEach(c => c.textContent = '');                // Clear all cell text in the UI
} // End resetBoard

