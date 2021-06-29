'use strict';
//Logic

export function createBoard(boardSize, numberOfMInes) {
    const board = [];
    if (boardSize ** 2 >= numberOfMInes) {
        /*rellenamos el array con 'tiles'*/
        for (let y = 0; y < boardSize; y++) {
            let row = [];
            for (let x = 0; x < boardSize; x++) {
                let tile = {
                    xPosition: x + 1,
                    yPosition: y + 1,
                    value: 0,
                }
                row.push(tile);
            }
            board.push(row);
        }

        /* el 'value' en las tiles es:
         * -1 cuando hay una mina
         * 0 cuando no contienen nada
         * otro numero si contiene un numero
         */

        /*introducimos minas en el board*/
        let introducedMines = 0;
        while (introducedMines < numberOfMInes) {

            let xPos = Math.floor(Math.random() * boardSize) + 1;
            let yPos = Math.floor(Math.random() * boardSize) + 1;

            if (board[yPos - 1][xPos - 1].value !== -1) {//solo introducimos la mina si no hay ya una
                board[yPos - 1][xPos - 1].value = -1;
                introducedMines++;
            }
        };

        /*buscamos minas y sumamos 1 a las tiles de su alrededor que no sean minas*/
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {

                if (board[y][x].value !== -1) { // Se salta la iteracion si no es una mina
                    continue;
                }

                let isAbajo = y === 0,
                    isArriba = y === (boardSize - 1),
                    isIzq = x === 0,
                    isDer = x === (boardSize - 1);

                if (isAbajo) {
                    if (isIzq) {
                        sumarValorTile(y, x, 2);
                        sumarValorTile(y, x, 3);
                        sumarValorTile(y, x, 4);
                    } else if (isDer) {
                        sumarValorTile(y, x, 8);
                        sumarValorTile(y, x, 1);
                        sumarValorTile(y, x, 2);
                    } else {
                        sumarValorTile(y, x, 8);
                        sumarValorTile(y, x, 1);
                        sumarValorTile(y, x, 2);
                        sumarValorTile(y, x, 3);
                        sumarValorTile(y, x, 4);
                    }
                } else if (isArriba) {
                    if (isIzq) {
                        sumarValorTile(y, x, 4);
                        sumarValorTile(y, x, 5);
                        sumarValorTile(y, x, 6);
                    } else if (isDer) {
                        sumarValorTile(y, x, 6);
                        sumarValorTile(y, x, 7);
                        sumarValorTile(y, x, 8);
                    } else {
                        sumarValorTile(y, x, 4);
                        sumarValorTile(y, x, 5);
                        sumarValorTile(y, x, 6);
                        sumarValorTile(y, x, 7);
                        sumarValorTile(y, x, 8);
                    }
                } else if (isIzq) {
                    sumarValorTile(y, x, 2);
                    sumarValorTile(y, x, 3);
                    sumarValorTile(y, x, 4);
                    sumarValorTile(y, x, 5);
                    sumarValorTile(y, x, 6);
                } else if (isDer) {
                    sumarValorTile(y, x, 6);
                    sumarValorTile(y, x, 7);
                    sumarValorTile(y, x, 8);
                    sumarValorTile(y, x, 1);
                    sumarValorTile(y, x, 2);
                } else {
                    sumarValorTile(y, x, 1);
                    sumarValorTile(y, x, 2);
                    sumarValorTile(y, x, 3);
                    sumarValorTile(y, x, 4);
                    sumarValorTile(y, x, 5);
                    sumarValorTile(y, x, 6);
                    sumarValorTile(y, x, 7);
                    sumarValorTile(y, x, 8);
                }
            }
        }
    }

    function sumarValorTile(tile_y, tile_x, tileNumber) {
        //tileNumber es un numero del 1 al 8, siendo 1 la tile de arriba a la izq, y siguiendo las agujas del reloj
        switch (tileNumber) {
            case 1:
                if (board[tile_y + 1][tile_x - 1].value !== -1) { board[tile_y + 1][tile_x - 1].value += 1; }
                break;
            case 2:
                if (board[tile_y + 1][tile_x].value !== -1) { board[tile_y + 1][tile_x].value += 1; }
                break;
            case 3:
                if (board[tile_y + 1][tile_x + 1].value !== -1) { board[tile_y + 1][tile_x + 1].value += 1; }
                break;
            case 4:
                if (board[tile_y][tile_x + 1].value !== -1) { board[tile_y][tile_x + 1].value += 1; }
                break;
            case 5:
                if (board[tile_y - 1][tile_x + 1].value !== -1) { board[tile_y - 1][tile_x + 1].value += 1; }
                break;
            case 6:
                if (board[tile_y - 1][tile_x].value !== -1) { board[tile_y - 1][tile_x].value += 1; }
                break;
            case 7:
                if (board[tile_y - 1][tile_x - 1].value !== -1) { board[tile_y - 1][tile_x - 1].value += 1; }
                break;
            case 8:
                if (board[tile_y][tile_x - 1].value !== -1) { board[tile_y][tile_x - 1].value += 1; }
                break;
            default:
                break;
        }
    }

    return board;
}