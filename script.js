"use strict"


//modules
//-------

const gameBoard = (()=>{

  //private


  //public
  const board = {
    cell_0 : [" ", " "],
    cell_1 : [" ", " "],
    cell_2 : [" ", " "],
    cell_3 : [" ", " "],
    cell_4 : [" ", " "],
    cell_5 : [" ", " "],
    cell_6 : [" ", " "],
    cell_7 : [" ", " "],
    cell_8 : [" ", " "],
  };
  
  return {
    board,
  };
})();



const gameFlow = (()=>{

  //private
  let _turnPlayerNum = 0;
  //cyclic counter to keep track of who is up next
  const _incrementTurnPlayerNum = () => {
    const numPlayers =  Object.keys(players).length;
    _turnPlayerNum = (_turnPlayerNum + 1) % numPlayers;
  }

  const _winLookup = {
    //lookup table for the winning lines
    0: [0,1,2],
    1: [3,4,5],
    2: [6,7,8],
    3: [0,3,6],
    4: [1,4,7],
    5: [2,5,8],
    6: [0,4,8],
    7: [2,4,6],
  };

  //public
  const changeTurnPlayer = (reset=false) => {
    //if passed true, set turn player back to start
    if (reset) {
      players[`player${_turnPlayerNum}`].isTurnPlayer = false;
      players.player0.isTurnPlayer = true
      _turnPlayerNum = 0;
    }
    //else rotate through the players cyclically by editing their properties
    else {
      players[`player${_turnPlayerNum}`].isTurnPlayer = false;
      _incrementTurnPlayerNum();
      players[`player${_turnPlayerNum}`].isTurnPlayer = true;
    };
  };


  function checkEndCond() {
    //first check for a win
    let winner = "";
    Object.values(_winLookup).forEach(value => {
      const firstVal = gameBoard.board[`cell_${value[0]}`][0];
      //match first element of any winning line to the others, and non-zero
      if ( firstVal!== " " &&
      firstVal == gameBoard.board[`cell_${value[1]}`][0] && 
      firstVal == gameBoard.board[`cell_${value[2]}`][0]) {
        winner = players[`player${_turnPlayerNum}`].marker[0] + " wins the game!";
      }
    });
    //next check for draw by reading board cells in turn
    let isDraw = true;
    Object.keys(gameBoard.board).forEach(key => {
      //if any one cell is still empty, it is not yet a draw 
      if (gameBoard.board[key][0]===" ") {
        isDraw = false;
      };
    });
    if (winner) {
      displayController.log(winner);
      return true; //game ends
    } else if (isDraw) {
      displayController.log("The game was a DRAW");
      return true; //game ends
    }  else {
      return false; //game continues
    };
  }

  const toggleAiMode = (() => {
    let isAiMode = false;
    const aiMode = ()=>{
      isAiMode = !isAiMode;
      if (isAiMode) {
        //write AI controller here
      };
    };
    return aiMode; 
  })()
  
  return {
    changeTurnPlayer,
    checkEndCond,
    toggleAiMode,
  };
})();



const displayController = (()=>{

  //private
  const _getIdNum = (node) => {
    //returns cell number to reference board from a DOM node
    return node.id.slice(5);
  };

  function _markCell(targetNum) {
    //finding the turn Player's marker design, arg 0 for text, 1 for image
    const turnPlayerMarker = (isImg) => {
      const temp = [];
      //push true or false for isTurnPlayer for each player in our game
      Object.keys(players).forEach(player => 
        temp.push(players[player].isTurnPlayer));
      //validating if the turn player is unique 
      //(first index was found, and equals last index)
      const index = temp.indexOf(true);
      if (index != -1 && index == temp.lastIndexOf(true)) {
        return players[`player${index}`].marker[isImg];
      } else {
        throw "ERROR: Either none or multiple turn players found";
      };
    }

    //mark the target cell with the turn players marker
    gameBoard.board[`cell_${targetNum}`] = [turnPlayerMarker(0), turnPlayerMarker(1)];
    _renderDisplay();
    const end = gameFlow.checkEndCond();
    if (end) {
      _removeListeners();
    } else {
      gameFlow.changeTurnPlayer();
      log(turnPlayerMarker(0) + " to move next");
    }
  }

  //sets up and removes the game cells click listeners
  const _convertMarkerEvent = (event) => {_markCell(_getIdNum(event.target))};
  const _addListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => 
      node.addEventListener("click", _convertMarkerEvent, {once : true}));
  };
  //run once to initialize
  _addListeners();

  const _removeListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => 
      node.removeEventListener("click", _convertMarkerEvent));
  };

  const _resetGame = () => {
    _removeListeners();
    _addListeners();
    _renderDisplay(true); //clears
    gameFlow.changeTurnPlayer(true); //player 0 to start
    log(players.player0.marker[0] + " to move next");
  };

  //Add Button Controls
  (() => {
    const restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", _resetGame);
    const aiBtn = document.querySelector(".ai-button");
    aiBtn.addEventListener("click", ()=>{
      //toggle button color
      if (aiBtn.style["background-color"] == "rgb(45, 153, 243)") {
        aiBtn.style = "background-color:rgb(71, 179, 211);"
      } else {
        aiBtn.style = "background-color:rgb(45, 153, 243);"
      };
      gameFlow.toggleAiMode();
    });
  })();

  const _renderDisplay = (clear=false) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => {
      //if passed clear=true, clears cell value
      if (clear==true) {
        gameBoard.board[`cell_${_getIdNum(node)}`] = [" ", " "];
      };
      //then sets the displayed value of each cell 
      //to its stored value in the board object
      node.innerHTML = gameBoard.board[`cell_${_getIdNum(node)}`][1];
    })
  };

  //public

  const log = (message) => {
    const span = document.querySelector(".message");
    span.innerHTML = message;
  }

  return {
    log,
  };
})();



//factories
//---------

const PlayerFactory = () => {
  
  //private
  const _getPlayerNum = () => {
    return Object.keys(players).length;
  };

  const _assignMarker = () => {
    //lookup table to provide easy maintenance
    const markerLookup = {
      0: ["X", "<img class=\"cross\" src=\"./assets/cross.svg\" alt=\"X\"></img>"],
      1: ["0", "<img class=\"nought\" src=\"./assets/nought.svg\" alt=\"0\"></img>"],
    };
    return markerLookup[_getPlayerNum()];
  }

  //public


  return {
    name: `Player${_getPlayerNum()}`,
    marker: _assignMarker(),
    //start game with 0th player to move
    isTurnPlayer: _getPlayerNum() == 0 ? true : false,
  };
};

//call factory to save players in an object
const players = {};
players.player0 = PlayerFactory();
players.player1 = PlayerFactory();