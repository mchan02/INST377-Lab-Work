document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const StartButton = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draws the tetrimino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    });
  }
  
  // undraws/erases the tetrimino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
  });
  }

  // allows the tetriminoes to fall down
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // moves the tetriminoes to the left when the left arrow key is pressed
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  // moves the tetriminoes to the right when the right arrow key is pressed
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1));
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  // rotates the tetrominoes when the up arrow key is pressed
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // matches the arrow key to the corresponding functions
  function control(key) {
    if (key.keyCode === 37) {
      moveLeft();
    } else if (key.keyCode === 38) {
      rotate();
    } else if (key.keyCode === 39) {
      moveRight();
    } else if (key.keyCode === 40) {
      moveDown();
    }
  }

  // shows upcoming tetriminoes in mini grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t
    [0, 1, displayWidth, displayWidth + 1], // o
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i
  ];

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    });
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    });
  }

  document.addEventListener('keyup', control);

  StartButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape();
    }
  })

  // calculates and displays the score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // stops the tetriminoes from falling off of the screen
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = nextRandom; 
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
    }
  }
});