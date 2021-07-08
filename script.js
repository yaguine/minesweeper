'use strict';

//Display / UI
//Boards standard -- 9x9, 10 minas -- 16x16, 40 minas

import { createBoard } from "./minesweeper.js"


/*establecemos los elementos globales*/

const BOARD_SIZE = 16
const TOTAL_MINES = 40

const minesLeftSpan = document.getElementById('mines-left')
const board = createBoard(BOARD_SIZE, TOTAL_MINES)
const boardElement = document.querySelector('.board')
const boardArray = []
boardElement.style.grid = `auto-flow 50px / repeat(${board.length},50px)`
minesLeftSpan.textContent = TOTAL_MINES

const EMOJI_FACES = {
    regular: '&#128522;',
    click: '&#128562;',
    loser: '&#128565;',
    winner:'&#129321;'
}
const emojisDiv = document.querySelector('.emoji-faces')
const emojisDiv2 = document.querySelector('.emoji-faces:focus')

const reloadDiv = document.getElementById('reload-div')
const reloadButton = reloadDiv.querySelector('button')
reloadButton.addEventListener('click',() => location.reload())



/*Rellenamos el board */

for (let i = 0; i <= board.length - 1; i++) { // generamos el board en orden inverso para que el (0,0) esté abajo a la izquierda
    boardArray.push([])
    for (const tile of board[i]) {
        let div = document.createElement('div')

        //le damos al div los atributos del 'tile'
        div.dataset.xPosition = tile.xPosition
        div.dataset.yPosition = tile.yPosition
        div.dataset.value = tile.value
        div.dataset.revealed = 'false'

        //establecemos los eventos para el click izquierdo y el derecho
        div.addEventListener('contextmenu', (e) => e.preventDefault())
        div.addEventListener('contextmenu', (e) => mark(div))
        div.addEventListener('click', (e) => reveal(div))

        //establecemos los eventos para cambiar el emoji al hacer click
        div.addEventListener('mousedown', (e) => emojisDiv.innerHTML = EMOJI_FACES['click'])
        div.addEventListener('mouseup', (e) => emojisDiv.innerHTML = EMOJI_FACES['regular'])

        //agregamos el div al elemento .board
        boardElement.appendChild(div)

        boardArray[i].push(div)
    }
}


/* 
 * funcion que se ejecuta al hacer click derecho sobre un casilla
 * marca / desmarca la casilla en caso de que no este revelada
 */
function mark(div) {
    if (div.dataset.revealed === 'true') return
    div.classList.toggle('marked')
    updateMinesLeft()
}


/* 
 * funcion que se ejecuta al hacer click izquierdo sobre una casilla
 * solo hace algo si la casilla no esta revelada
 * desmarca y revela la casilla, y tiene diferente efecto dependiendo del valor de la casilla
 */
function reveal(div) {
    if (div.dataset.revealed === 'true') return
    div.classList.remove('marked')
    div.dataset.revealed = 'true'

    const xPositionCurrentDiv = parseInt(div.dataset.xPosition)
    const yPositionCurrentDiv = parseInt(div.dataset.yPosition)
    let value = div.dataset.value

    if (value === '0') {
        div.innerHTML = value
        let closeDivs = getCloseDivs(xPositionCurrentDiv, yPositionCurrentDiv)
        closeDivs.forEach(reveal.bind(null))
    }
    else if (value === '-1') {
        div.classList.add('mined')
        emojisDiv.innerHTML = EMOJI_FACES['loser']
        setTimeout(() => alert('HAS PERDIDO'), 50)
        setTimeout(() => reloadDiv.classList.add('displayed'), 100)
    }
    else div.innerHTML = value

    updateMinesLeft()
    checkVictory()
}

/*funcion que devuelve un array con las casillas colindantes (incluyendo la propia)*/
function getCloseDivs(xPosition, yPosition) {
    let closeDivs = []
    for (let x = xPosition - 2; x <= xPosition; x++) {
        for (let y = yPosition - 2; y <= yPosition; y++) {
            let tile = boardArray[y]?.[x]
            if (tile) {
                if ((parseInt(tile.dataset.xPosition) === xPosition) && (parseInt(tile.dataset.yPosition) === yPosition)) continue
                closeDivs.push(boardArray[y][x])
            }
        }
    }
    return closeDivs
}


/*funcion que actualiza las minas restantes*/
function updateMinesLeft() {
    const allDivs = Array.from(document.querySelectorAll('.board > div'))
    const markedDivs = allDivs.filter((item) => item.classList.contains('marked'))

    minesLeftSpan.textContent = TOTAL_MINES - markedDivs.length
}


/*comprueba si el jugador ha ganado. en tal caso, muestra una alert*/
function checkVictory() {
    const allDivs = Array.from(document.querySelectorAll('.board > div'))
    const revealedDivs = allDivs.filter((item) => item.dataset.revealed === "true")

    if (revealedDivs.length === (BOARD_SIZE ** 2 - TOTAL_MINES)) {
        emojisDiv.innerHTML = EMOJI_FACES['winner']
        setTimeout(() => alert('HAS GANADO'),50)
        setTimeout(() => reloadDiv.classList.add('displayed'),100)
    }
}