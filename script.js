const gameState = {
    board: [],
    selectedSquare: null,
    turn: 'r',
    moves: 0
}

const board = document.querySelector('#game-board')
const squares = document.querySelectorAll('.square')
const pieces = document.querySelectorAll('.piece')

const turn = document.querySelector("#turn")
const moves = document.querySelector("#moves")
const message = document.querySelector('#message')

const placeMarkers = () => {

    // create scrambled copy of DOM squares list
    const tempSquares = [...squares].sort((a,b) => .5 - Math.random())

    // place one red and one blue piece, four times
    for (let i = 0; i < 4; i++) {
        const red = tempSquares.pop()
        red.classList.add('red')
        squareToIndex(red,'r')
        const blue = tempSquares.pop()
        blue.classList.add('blue')
        squareToIndex(blue,'b')
    }
}

const canOccupy = (destinationSquare, originSquare) => {
    if (
        destinationSquare.classList.contains('red')
        || destinationSquare.classList.contains('blue')
        ) {
            return false
        } else {
            const o = originSquare.id.split('-')
            const d = destinationSquare.id.split('-')
            if (
                Math.abs(o[0]-d[0]) > 1
                || Math.abs(o[1]-d[1]) > 1
                // below precludes diagonals
                // || Math.abs(o[0]-d[0]) === Math.abs(o[1]-d[1])
            ) {
                return false
            } else {
                return true
            }
        }
}

// converts a DOM square's ID to coordinates in gameState.board
// val is inserted at that index
const squareToIndex = (square, val=" ") => {
    const coords = square.id.split('-')
    gameState.board[coords[0]][coords[1]] = val
}

const switchTurn = () => {
    board.classList.remove(gameState.turn)
    gameState.turn = gameState.turn === "r" ? "b": "r"
    board.classList.add(gameState.turn)
    gameState.selectedSquare = null
    board.classList.remove('piece-selected')
    if (turn.classList.contains('red')) {
        turn.classList.remove('red')
        turn.classList.add('blue')
    } else {
        turn.classList.remove('blue')
        turn.classList.add('red')
    }
}

const victoryRows = [
    [[0,0],[0,1],[0,2],[0,3]],
    [[1,0],[1,1],[1,2],[1,3]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[3,0],[3,1],[3,2],[3,3]],
    [[0,0],[1,0],[2,0],[3,0]],
    [[0,1],[1,1],[2,1],[3,1]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[0,3],[1,3],[2,3],[3,3]],
    [[0,0],[1,1],[2,2],[3,3]],
    [[0,3],[1,2],[2,1],[3,0]]
]

const checkForWinner = () => {
    const win = victoryRows.find(row => {
        const occ = row
            .map(x => gameState.board[x[0]][x[1]])
            .reduce((a,c) => a.includes(c) ? a : a + c)
            console.log(occ)
        return occ.length === 1 && !occ.includes(' ')
    })
    return win || false
}

const showWinner = (winRow) => {
    if (winRow) {
        winRow.forEach(coordPair => {
            document.getElementById(`${coordPair[0]}-${coordPair[1]}`)
                .classList.add('win')
        })
        gameState.selectedSquare = null
        const winner = {r:"RED",b:"BLUE"}[gameState.board[winRow[0][0]][winRow[0][1]]]
        message.innerHTML = `<div><span class="${winner.toLowerCase()}">${winner}</span> WINS! PLAY AGAIN?</div>`
        return true
    }
    return false
}

squares.forEach(square => {
    square.addEventListener('click', e => {
        if (!gameState.selectedSquare) {
            gameState.selectedSquare = square
            board.classList.add('piece-selected')
            square.classList.add('selected')
        } else if (gameState.selectedSquare === square) {
            gameState.selectedSquare.classList.remove('selected')
            gameState.selectedSquare = null
            board.classList.remove('piece-selected')
        } else{
            if (canOccupy(square, gameState.selectedSquare)) {
                const color = gameState.selectedSquare.classList.contains('red') ?
                    "red" : "blue"
                squareToIndex(square, color[0])
                squareToIndex(gameState.selectedSquare)
                square.classList.add(color)
                gameState.selectedSquare.classList.remove(color)
                gameState.selectedSquare.classList.remove('selected')
                gameState.moves += 1
                moves.innerText = gameState.moves
                showWinner(checkForWinner()) || switchTurn()
            } else {
                console.log('cant!')
            }
        }
    })
})


const newGame = () => {
    
    // clear all "pieces" from DOM and gameState
    squares.forEach(square => square.setAttribute('class', 'square'))
    gameState.board = [
        [" ", " ", " ", " "],
        [" ", " ", " ", " "],
        [" ", " ", " ", " "],
        [" ", " ", " ", " "]
    ]
    
    // clear the message and reset moves
    message.innerHTML = ""
    gameState.moves = 0
    moves.innerHTML = gameState.moves
    
    // make it red's turn
    gameState.turn === "b" && switchTurn()
    board.classList.add('r')
    
    placeMarkers()
}

message.addEventListener('click', newGame)
