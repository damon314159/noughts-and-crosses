"use strict"


//modules
//-------

const gameBoard = (()=>{

  //private


  //public
  const board = {
    cell_0 : " ",
    cell_1 : " ",
    cell_2 : " ",
    cell_3 : " ",
    cell_4 : " ",
    cell_5 : " ",
    cell_6 : " ",
    cell_7 : " ",
    cell_8 : " ",
  };
  
  return {
    board,
  };
})();

const gameFlow = (()=>{

  //TODO: IMPLEMENT GAME END CONDITIONS

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
  const changeTurnPlayer = () => {
    //rotate through the players cyclically by editing their properties
    players[`player${_turnPlayerNum}`].isTurnPlayer = false;
    _incrementTurnPlayerNum();
    players[`player${_turnPlayerNum}`].isTurnPlayer = true;
  }


  function checkEndCond() {
    //first check for a win
    let winner = "";
    Object.values(_winLookup).forEach(value => {
      const firstVal = gameBoard.board[`cell_${value[0]}`];
      //match first element of any winning line to the others, and non-zero
      if ( firstVal!== " " &&
      firstVal == gameBoard.board[`cell_${value[1]}`] && 
      firstVal == gameBoard.board[`cell_${value[2]}`]) {
        winner = firstVal + " wins";
      }
    });
    //next check for draw by reading board cells in turn
    let isDraw = true;
    Object.values(gameBoard.board).forEach(value => {
      //if any one cell is still empty, it is not yet a draw 
      if (value===" ") {
        isDraw = false;
      };
    });
    if (winner) {
      console.log(winner);
      return true;
    } else if (isDraw) {
      console.log("Draw");
      return true;
    }  else {
      return false;
    };
  }
  
  return {
    changeTurnPlayer,
    checkEndCond,
  };
})();

const displayController = (()=>{

  //private
  const _getIdNum = (node) => {
    //returns cell number to reference board from a DOM node
    return node.id.slice(5);
  };

  function _markCell(event) {
    //finding the turn Player's marker design
    const turnPlayerMarker = (() => {
      const temp = [];
      //push true or false for isTurnPlayer for each player in our game
      Object.keys(players).forEach(player => 
        temp.push(players[player].isTurnPlayer));
      //validating if the turn player is unique 
      //(first index was found, and equals last index)
      const index = temp.indexOf(true);
      if (index != -1 && index == temp.lastIndexOf(true)) {
        return players[`player${index}`].marker;
      } else {
        throw "ERROR: Either none or multiple turn players found";
      };
    })();

    //mark the target cell with the turn players marker
    gameBoard.board[`cell_${_getIdNum(event.target)}`] = turnPlayerMarker;
    renderDisplay();
    const end = gameFlow.checkEndCond();
    if (end==true) {
      _removeListeners();
    };
    gameFlow.changeTurnPlayer();
  }

  const _addListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => node.addEventListener("click", _markCell, {once : true}))
  };
  //run once to initialize
  _addListeners();

  const _removeListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => node.removeEventListener("click", _markCell))
  };

  //public
  const renderDisplay = (clear=false) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(node => {
      //if passed clear=true, renders cells empty
      if (clear==true) {
        node.innerHTML = " ";
      } else {
      //else sets the displayed value of each cell 
      //to its stored value in the board object
        node.innerHTML = gameBoard.board[`cell_${_getIdNum(node)}`];
      };
    })
  };

  const resetGame = () => {
    _removeListeners();
    _addListeners();
    renderDisplay(true); //clears
  };

  return {
    renderDisplay,
    resetGame,
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
      0: "X",
      1: "0",
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