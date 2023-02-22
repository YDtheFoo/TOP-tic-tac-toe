let boardSize = 3
let boardArray = []
let winCombinations = []
let playerOne = []
let playerTwo = []
let playerOneScore = 0
let playerTwoScore = 0
let isBlueTurn = true
let hoverGradient = 'linear-gradient(45deg, #c3e7ff, #ffffff)'
const gameBoard = document.querySelector('.game-board');
const playerOneScoreDom = document.querySelector('.player-one-score');
const playerTwoScoreDom = document.querySelector('.player-two-score');

class Square{
    constructor(idx){
        this.idx = idx
        this.isSet = false
    }
    appendToDom(dom, size, boardWidth){
        //calculate the width and height for each square element
        const width = Math.floor(boardWidth/size*10)/10
        const div = document.createElement('div')

        //only need width because it's a square, width === height
        div.style.width = `${width}px`
        div.style.height =`${width}px`

        //add some styles, not important
        div.classList.add('square')
        div.style.animation = `glow 5s ease-in-out ${Math.random()*5}s infinite`
        
        //push to parent dom
        dom.appendChild(div)

        //prefer have the "this" keyword point to class object rather then the dom element
        //down below binds the proper "this" to each event
        this.dom = div

        //gasp is completely unnecessary, I just didn't like how css animation worked above ^
        gsap.from(div, {
            opacity: 0, 
            y: -500, 
            duration: 1,
            delay: Math.random(),
            ease: Bounce.easeOut,
        },)

        //add mouseenter and mouseleave event
        div.addEventListener('mouseenter', this.mouseEnter.bind(this))
        div.addEventListener('mouseleave', this.mouseLeave.bind(this))
        div.addEventListener('click', this.click.bind(this))
    }
    mouseEnter(){
        //mouse enter event, not sure why I need to reset animation, but otherwise it didn't work
        //should only change background when square has not been selected
        if(!this.isSet){
            this.applyGradient(hoverGradient)
        }
    }
    mouseLeave(){
        //same as above "mouseEnter"
        if(!this.isSet){
            this.applyGradient('linear-gradient(45deg, #eeeeee, #ffffff)')
        }
    }
    click(){
        //each square can only be selected once
        if(!this.isSet){
            this.isSet = true
            if(isBlueTurn){
                this.applyGradient('linear-gradient(45deg, #0394fc, #7dc6fa)')
                playerOne.push(this.idx)
                if(checkIfPlayerWon(playerOne, winCombinations)){
                    playerWon()
                }
            }else{
                this.applyGradient('linear-gradient(45deg, #ff5e5e, #faa5a5)')
                playerTwo.push(this.idx)
                if(checkIfPlayerWon(playerTwo, winCombinations)){
                    playerWon(false)
                }
            }

            //draw
            if(playerOne.length + playerTwo.length >= boardArray.length) generateBoard(boardSize)

            //change turn, and hover color
            isBlueTurn = !isBlueTurn
            hoverGradient = isBlueTurn ? 'linear-gradient(45deg, #c3e7ff, #ffffff)' : 'linear-gradient(45deg, #ffdddd, #ffffff)'
        }
    }
    applyGradient(gradient){
        this.dom.style.background = gradient
        this.dom.style.backgroundSize = "400%"
        this.dom.style.animation = `glow 5s ease-in-out ${Math.random()*5}s infinite`
    }
}

function calcWinCombinations(array){

    const wins = []
    //check to see array.length is a perfect square
    //if array.length is not a perfect square, it can't be a square board, so return false
    if(Math.sqrt(array.length)%1 !== 0) return false

    //turn array into a 2 dimensional array
    //since array is a perfect square, we already know the width and height of the 2-dimensional array
    //using some util lib like lodash would be very easy, _.chunk(array, Math.sqrt(array.length))
    //but let's create our own chunk real quick
    let board = chunk(array, Math.sqrt(array.length))

    //board.length is the same as width and height of the board
    //loop through all the rows and columns
    for(let i = 0; i < board.length; i++){
        //the row
        wins.push(board[i])
        //the column
        const column = []
        for(let j = 0; j < board.length; j++){
        column.push(board[j][i])
        }
        wins.push(column)
    }

    //diagonals, this feels really stupid but i'm stupid so it's ok
    let topLeft = []
    let topRight = []
    for(let i = 0; i < board.length; i++){
        topLeft.push(board[i][i])
        topRight.push(board[i][board.length - 1 - i])
    }
    wins.push(topLeft, topRight)

    return wins
}

//trying to do the same as lodash _.chunk
function chunk(array, width){
    const b = []
    let r = []
    let c = 0
    for(let i = 0; i < array.length; i++){
        r.push(array[i])
        c++;
        if(c >= width){
            b.push(r)
            r = []
            c = 0
        }
    }
    return b
}

function checkIfPlayerWon(array, combinations){
    //this is O(n^3)?
    //sorting the player array before compare will reduce complexity to O(n^2)


    //loop through combinations
    for(let i = 0; i < combinations.length; i++){
        //if combinations[i] is a subset of array return true
        if(combinations[i].every(i=> array.includes(i))) return true
    }
    //else return false
    return false
}

//render board
function generateBoard(size = 3){
    gameBoard.innerHTML = ""
    const arraySize = size * size
    //init board
    playerOne = []
    playerTwo = []
    isBlueTurn = true
    hoverGradient = 'linear-gradient(45deg, #c3e7ff, #ffffff)'
    //style gameBoard
    const boardWidth = window.innerWidth / 2
    gameBoard.style.width = `${boardWidth}px`
    gameBoard.style.height = `${boardWidth}px`

    //init boardArray
    boardArray = []
    for(let i = 0; i< arraySize; i++){
        //generate boardArray
        //only doing this because I already wrote the calcWinCombinations function earlier, this is stupid, but im stupid, so it's ok
        boardArray.push(i)
        const square = new Square(i)
        square.appendToDom(gameBoard, size, boardWidth)
    }
    winCombinations = calcWinCombinations(boardArray)
}

function playerWon(blueWon = true){
    if(blueWon){
        playerOneScore++
    }else{
        playerTwoScore++
    }
    playerOneScoreDom.innerText = playerOneScore
    playerTwoScoreDom.innerText = playerTwoScore
    generateBoard(boardSize)
}

//increase boardSize and re-render
function increaseBoardSize(){
    boardSize++
    generateBoard(boardSize)
}
//decrease boardSize and re-render
function decreaseBoardSize(){
    if(boardSize <= 1) return
    boardSize--
    generateBoard(boardSize)
}


generateBoard(boardSize)

