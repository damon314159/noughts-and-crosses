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

  //private


  //public

  
  return {
    //publicMethods,
    //publicObjects,
  };
})();

const displayController = (()=>{

  //private
  const _getIdNum = (node) => {
    //returns cell number to reference board from a DOM node
    return node.id.slice(5);
  };

  function _markCell(event) {
    //TODO
    //access cell with gameBoard.board[`cell_${_getIdNum(event.target)}`]
    //access turn player with looping over i to make array players[`player${i}`], get index of true
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
      //if passed clear, renders empty
      if (clear=true) {
        node.innerHTML = " ";
      } else {
      //else sets the displayed value of each cell to its stored value in the board object
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
    return Object.keys(players).length + 1;
  };

  const _assignMarker = () => {
    //lookup table to provide easy maintenance
    const markerLookup = {
      1: "X",
      2: "0",
    };
    return markerLookup[_getPlayerNum()];
  }

  //public


  return {
    name: `Player${_getPlayerNum()}`,
    marker: _assignMarker(),
    isTurnPlayer: false,
  };
};

//call factory to save players in an object
const players = {};
players.player1 = PlayerFactory();
players.player2 = PlayerFactory();