'use strict';

//Display / UI
//Boards standard -- 9x9, 10 minas -- 16x16, 40 minas

import { createBoard } from "./minesweeper.js"

let board = createBoard(16,40);
console.log(board);

let boardElement = document.querySelector('.board');

for(let i=board.length-1; i>=0; i--) { // Generamos el board en orden inverso para que el (0,0) esté abajo a la izquierda
    boardElement.innerHTML +='<p>';
    for(const tile of board[i]) {
        boardElement.innerHTML += `${tile.value}` ;
    }
    boardElement.innerHTML +='</p>';
}