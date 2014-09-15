/* jshint strict: true, browser: true, devel: true */
/*
 * Tic-tac-toe
 * Created 2014 Triangle717
 * <http://le717.github.io/>
 *
 * License under the MIT License
 * <http://opensource.org/licenses/MIT/>
 */


// Get the player name and squares elements
var playerX       = document.querySelector("#player-x"),
    playerO       = document.querySelector("#player-o"),
    winsX         = document.querySelector(".score-x"),
    winsO         = document.querySelector("score-o"),
    tableSquares  = document.querySelectorAll(".game-board td"),
    possiblePlays = 72;


/**
 * Indicate the current player's turn
 * @param {string} playerName
 */
function yourTurn(playerName) {
  "use strict";
  if (playerName === "x") {
    playerX.style.display = "none";
    playerO.style.display = "block";
  } else {
    playerX.style.display = "block";
    playerO.style.display = "none";
  }
}


/**
 * Increase the player score
 * @param {string} playerName
 */
function increaseScore(playerName, newScore) {
  "use strict";
  var score    = document.querySelector(".score-" + playerName),
      curScore = parseInt(score.innerHTML, 10) + 1;

  // Increase the score due to someone winning
  if (newScore === "none") {
    score.innerHTML = curScore;
    localStorage["player-" + playerName + "-wins"] = curScore;

    // Display the stored game results
  } else if (newScore !== undefined) {
    score.innerHTML = newScore;
  }
}


/**
 * Tell who the winner was
 * @param {string} playerName
 */
function youWin(playerName) {
  "use strict";
  var blink  = document.querySelector(".blink"),
      winner = document.querySelector("#winner");

  // Hide the current turn display
  playerX.style.display = "none";
  playerO.style.display = "none";

  // Reveal the winner
  winner.style.display = "block";
  blink.style.webkitAnimationPlayState = "running";
  blink.style.animationPlayState = "running";

  // Only display who won in the rare chance it ended in a stalemate
  // The stalemate case is already present in the HTML
  if (playerName !== "nobody") {
    winner.innerHTML = "Player " + playerName.toUpperCase() + " wins!";
    increaseScore(playerName, "none");
  }

  // Freeze the table to prevent editing
  for (var box in tableSquares) {
    if (tableSquares.hasOwnProperty(box)) {
      tableSquares[box].removeEventListener("click", makeMove, true);
      tableSquares[box].style.cursor = "default";
    }
  }
}


/**
 * @private
 * Check if the elements if contain the specified text
 * @param {object} element
 * @param {string} str
 * @return {array}
 */
function _containsText(element, str) {
  "use strict";
  var content = [];

  for (var i = 0; i < element.length; i += 1) {
    if (element[i].innerHTML.indexOf(str) > -1) {
      content.push(element[i].innerHTML);
    }
  }
  return content;
}


/**
 * Check if the current player has won
 * @param {string} playerName
 */
function checkIfWon(playerName) {
  "use strict";
  var hasThreeInARow = false,
      groups = [document.querySelectorAll(".r1"), document.querySelectorAll(".r2"), document.querySelectorAll(".r3"),
                document.querySelectorAll(".c1"), document.querySelectorAll(".c2"), document.querySelectorAll(".c3"),
                document.querySelectorAll(".d1"), document.querySelectorAll(".d2")];

  // Check each possible direction for possible win
  for (var i = 0; i < groups.length; i += 1) {
    if (_containsText(groups[i], playerName).length === 3) {
      hasThreeInARow = true;
      break;

      // A match was not found
    } else {
      possiblePlays -= 1;
    }
  }

  // "You're winner!"
  if (hasThreeInARow) {
    youWin(playerName);

    // Nope.avi
  } else if (!hasThreeInARow && possiblePlays === 0) {
    youWin("nobody");
  }
}


/**
 * Place an X or O where the user clicked
 * @param {event} e The event for the element clicked
 */
function makeMove(e) {
  "use strict";
  var isClicked = e.target;

  // Player X's turn
  if (playerO.style.display === "none") {
    isClicked.innerHTML = "<span class='marker-x'>x</span>";
    // Check if the winner has won or more rounds are needed
    yourTurn("x");
    checkIfWon("x");

    // Player O's turn
  } else {
    isClicked.innerHTML = "<span class='marker-o'>o</span>";
    // Check if the winner has won or more rounds are needed
    yourTurn("o");
    checkIfWon("o");
  }

  // Prevent the filled square from being changed
  isClicked.removeEventListener("click", makeMove, true);
}


/**
 * @private
 * Game initialization
 */
function _startGame() {
  "use strict";
  // Load the stored game results
   if (localStorage["player-x-wins"] || localStorage["player-o-wins"]) {
      increaseScore("x", localStorage["player-x-wins"]);
      increaseScore("o", localStorage["player-o-wins"]);
 }

  // Randomly pick the starting player
  if (Math.floor(Math.random() * 2) === 0) {
    yourTurn("x");
  } else {
    yourTurn("o");
  }

  // Make every box clickable
  for (var box in tableSquares) {
    if (tableSquares.hasOwnProperty(box)) {
      tableSquares[box].addEventListener("click", makeMove, true);
    }
  }
}


/**
 * Reset saved games scores
 */
document.querySelector(".game-reset").addEventListener("click", function() {
  "use strict";
  localStorage.clear();
  window.location.reload();
}, true);


/**
 * Start new game
 */
document.querySelector(".game-new").addEventListener("click", function() {
  "use strict";
  window.location.reload();
}, true);


// Start the game
window.onload = _startGame();
