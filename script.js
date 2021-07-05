'use strict';

//Display / UI
//Boards standard -- 9x9, 10 minas -- 16x16, 40 minas

import { createBoard } from "./minesweeper.js"

/*establecemos los elementos globales*/
const BOARD_SIZE = 10
const TOTAL_MINES = 10

const minesLeftSpan = document.getElementById('mines-left')
const board = createBoard(BOARD_SIZE, TOTAL_MINES)
const boardElement = document.querySelector('.board')

boardElement.style.grid = `auto-flow 50px / repeat(${board.length},50px)`
minesLeftSpan.textContent = TOTAL_MINES

for (let i = board.length - 1; i >= 0; i--) { // generamos el board en orden inverso para que el (0,0) esté abajo a la izquierda
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

        //agregamos el div al elemento .board
        boardElement.appendChild(div)
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

    let value = div.dataset.value

    if (value === '0') revealZeros(div)
    else if (value === '-1') {
        div.classList.add('mined')
        setTimeout(() => alert('HAS PERDIDO'), 50)
        setTimeout(() => location.reload(), 100)
    }
    else div.innerHTML = value

    updateMinesLeft()
    checkVictory()
}


/* 
 * funcion que se ejecuta si revelas una casilla con valor 0
 * revela las casillas alrededor, y ejecuta de nuevo la funcion para las casillas que valen 0, y asi sucesivamente
 */
function revealZeros(div) {
    const xPositionCurrentDiv = parseInt(div.dataset.xPosition)
    const yPositionCurrentDiv = parseInt(div.dataset.yPosition)

    //pasamos a un array todas las casillas
    const allDivs = Array.from(document.querySelectorAll('.board > div'))

    //filtramos las casillas que rodean a la seleccionada (incluida ella misma)
    let closeDivs = allDivs.filter(item => {
        let xPositionItem = parseInt(item.dataset.xPosition)
        let yPositionItem = parseInt(item.dataset.yPosition)
        let xDistance = Math.abs(xPositionCurrentDiv - xPositionItem)
        let yDistance = Math.abs(yPositionCurrentDiv - yPositionItem)
        return (xDistance <= 1) && (yDistance <= 1)
    })

    //iteramos
    let index = 0;
    for (let closeDiv of closeDivs) {
        index++;
        let xPositionItem = parseInt(closeDiv.dataset.xPosition)
        let yPositionItem = parseInt(closeDiv.dataset.yPosition)
        let valueItem = parseInt(closeDiv.dataset.value)

        closeDiv.innerHTML = valueItem
        closeDiv.classList.remove('marked')
        closeDiv.dataset.revealed = 'true'
        //nos saltamos la propia casilla
        if ((xPositionItem === xPositionCurrentDiv) && (yPositionItem === yPositionCurrentDiv)) continue
         if(valueItem === 0) setTimeout(() => revealZeros(closeDiv),index)
        //if(valueItem === 0) setTimeout(() => revealZeros.bind(null, closeDiv),index*10)
    }
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
        alert('HAS GANADO')
        location.reload()
    }
}