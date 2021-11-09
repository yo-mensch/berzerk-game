let ctx;
let interval = null;
let canvas;
let gameView;
let mazeHeight;
let mazeWidth;
let player;
let level = 1;
let redrawRequired = false;
let allBullets = [];
let enemies = [];
let directions = ["up", "down", "left", "right"];

class Player {
  constructor() {
    this.col = 0;
    this.row = 0;
  }

  shootUp() {
    var bullet = new Bullet(0);
    allBullets.push(bullet);
  }
  shootDown() {
    var bullet = new Bullet(1);
    allBullets.push(bullet);
  }
  shootLeft() {
    var bullet = new Bullet(2);
    allBullets.push(bullet);
  }
  shootRight() {
    var bullet = new Bullet(3);
    allBullets.push(bullet);
  }
}

class MazeCell {
  constructor(col, row) {
    this.col = col;
    this.row = row;

    this.eastWall = true;
    this.northWall = true;
    this.southWall = true;
    this.westWall = true;

    this.visited = false;
  }
}

class GameView {
  constructor(cols, rows, cellSize) {
    this.backgroundColor = "#fff";
    this.cols = cols;
    this.endColor = "#88FF88";
    this.mazeColor = "#000";
    this.playerColor = "#880088";
    this.enemyColor = "#FFA500";
    this.bulletColor = "#f55";
    this.rows = rows;
    this.cellSize = cellSize;

    this.cells = [];
  }

  generate() {
    mazeHeight = this.rows * this.cellSize;
    mazeWidth = this.cols * this.cellSize;

    canvas.height = mazeHeight;
    canvas.width = mazeWidth;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    for (let col = 0; col < this.cols; col++) {
      this.cells[col] = [];
      for (let row = 0; row < this.rows; row++) {
        this.cells[col][row] = new MazeCell(col, row);
      }
    }

    let rndCol = Math.floor(Math.random() * this.cols);
    let rndRow = Math.floor(Math.random() * this.rows);

    let stack = [];
    stack.push(this.cells[rndCol][rndRow]);

    let currCell;
    let dir;
    let foundNeighbor;
    let nextCell;

    while (this.hasUnvisited(this.cells)) {
      currCell = stack[stack.length - 1];
      currCell.visited = true;
      if (this.hasUnvisitedNeighbor(currCell)) {
        nextCell = null;
        foundNeighbor = false;
        do {
          dir = Math.floor(Math.random() * 4);
          switch (dir) {
            case 0:
              if (
                currCell.col !== this.cols - 1 &&
                !this.cells[currCell.col + 1][currCell.row].visited
              ) {
                currCell.eastWall = false;
                nextCell = this.cells[currCell.col + 1][currCell.row];
                nextCell.westWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (
                currCell.row !== 0 &&
                !this.cells[currCell.col][currCell.row - 1].visited
              ) {
                currCell.northWall = false;
                nextCell = this.cells[currCell.col][currCell.row - 1];
                nextCell.southWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (
                currCell.row !== this.rows - 1 &&
                !this.cells[currCell.col][currCell.row + 1].visited
              ) {
                currCell.southWall = false;
                nextCell = this.cells[currCell.col][currCell.row + 1];
                nextCell.northWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (
                currCell.col !== 0 &&
                !this.cells[currCell.col - 1][currCell.row].visited
              ) {
                currCell.westWall = false;
                nextCell = this.cells[currCell.col - 1][currCell.row];
                nextCell.eastWall = false;
                foundNeighbor = true;
              }
              break;
          }
          if (foundNeighbor) {
            stack.push(nextCell);
          }
        } while (!foundNeighbor);
      } else {
        currCell = stack.pop();
      }
    }

    this.redraw();
  }

  hasUnvisited() {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (!this.cells[col][row].visited) {
          return true;
        }
      }
    }
    return false;
  }

  hasUnvisitedNeighbor(mazeCell) {
    return (
      (mazeCell.col !== 0 &&
        !this.cells[mazeCell.col - 1][mazeCell.row].visited) ||
      (mazeCell.col !== this.cols - 1 &&
        !this.cells[mazeCell.col + 1][mazeCell.row].visited) ||
      (mazeCell.row !== 0 &&
        !this.cells[mazeCell.col][mazeCell.row - 1].visited) ||
      (mazeCell.row !== this.rows - 1 &&
        !this.cells[mazeCell.col][mazeCell.row + 1].visited)
    );
  }

  refresh() {
    this.refreshBullets();
    this.refreshEnemies();
    if (redrawRequired) {
      this.redraw();
      redrawRequired = false;
    }
  }

  refreshBullets() {
    var i = 0;
    var currentBullet;
    while (i < allBullets.length) {
      currentBullet = allBullets[i];
      if (currentBullet.hasHit) {
        allBullets.splice(i, 1);
      } else {
        currentBullet.move();
        i += 1;
      }
      redrawRequired = true;
    }
  }

  refreshEnemies(){
    var i = 0;
    var currentEnemy;
    while(i < enemies.length) {
      currentEnemy = enemies[i];
      if(currentEnemy.row === player.row && currentEnemy.col === player.col){
        var messageField = document.getElementById('message');
        messageField.innerHTML = "You got killed by an enemy! Refresh to start the game";
        endGame();
      }
      for(var j = 0; j < allBullets.length; j++) {
        if(allBullets[j].x === currentEnemy.col && allBullets[j].y === currentEnemy.row){
          enemies.splice(i, 1);
          allBullets.splice(j, 1);
          break;
        }
      }
      currentEnemy.move();
      i += 1;
    }
    redrawRequired = true;
  }

  redraw() {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, mazeHeight, mazeWidth);

    ctx.fillStyle = this.endColor;
    ctx.fillRect(
      (this.cols - 1) * this.cellSize,
      (this.rows - 1) * this.cellSize,
      this.cellSize,
      this.cellSize
    );

    ctx.strokeStyle = this.mazeColor;
    ctx.strokeRect(0, 0, mazeHeight, mazeWidth);

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.cells[col][row].eastWall) {
          ctx.beginPath();
          ctx.moveTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].northWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, row * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].southWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
        if (this.cells[col][row].westWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.cellSize, row * this.cellSize);
          ctx.lineTo(col * this.cellSize, (row + 1) * this.cellSize);
          ctx.stroke();
        }
      }
    }
    this.drawPlayer();
    this.drawBullets();
    this.drawEnemies();
  }

  drawPlayer() {
    ctx.fillStyle = this.playerColor;
    ctx.beginPath();
    ctx.arc(
      player.col * this.cellSize + 25,
      player.row * this.cellSize + 25,
      10,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }

  drawBullets() {
    for (var i = 0; i < allBullets.length; i++) {
      allBullets[i].draw();
    }
  }

  drawEnemies(){
    for (var i = 0; i < enemies.length; i++){
      enemies[i].draw();
    }
  }
}

class Bullet {
  constructor(bulletDirectionIndex) {
    this.bulletDirection = directions[bulletDirectionIndex];
    this.x = player.col;
    this.y = player.row;
    this.hasHit = false;
  }

  draw() {
    ctx.fillStyle = gameView.bulletColor;
    ctx.beginPath();
    ctx.arc(
      this.x * gameView.cellSize + 25,
      this.y * gameView.cellSize + 25,
      5,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }

  move() {
    if (this.bulletDirection === "up") {
      this.moveUp();
      return;
    }
    if (this.bulletDirection === "down") {
      this.moveDown();
      return;
    }
    if (this.bulletDirection === "right") {
      this.moveRight();
      return;
    }
    if (this.bulletDirection === "left") {
      this.moveLeft();
      return;
    }
  }

  moveLeft() {
    if (!gameView.cells[this.x][this.y].westWall) {
      this.x -= 1;
    } else {
      this.hasHit = true;
    }
  }

  moveRight() {
    if (!gameView.cells[this.x][this.y].eastWall) {
      this.x += 1;
    } else {
      this.hasHit = true;
    }
  }

  moveUp() {
    if (!gameView.cells[this.x][this.y].northWall) {
      this.y -= 1;
    } else {
      this.hasHit = true;
    }
  }

  moveDown() {
    if (!gameView.cells[this.x][this.y].southWall) {
      this.y += 1;
    } else {
      this.hasHit = true;
    }
  }
}

class Enemy {
  constructor(){
    this.row = Math.floor(Math.random() * 8) + 1;
    this.col = Math.floor(Math.random() * 8) + 1;
  }

  draw(){
    ctx.fillStyle = gameView.enemyColor;
    ctx.beginPath();
    ctx.arc(
      this.col * gameView.cellSize + 25,
      this.row * gameView.cellSize + 25,
      10,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }

  move(){
    var direction = directions[Math.floor(Math.random()*4)];
    switch(direction){
      case "up":
        if (!gameView.cells[this.col][this.row].northWall) {
          this.row -= 1;
        }
        break;
      case "down":
        if (!gameView.cells[this.col][this.row].southWall) {
          this.row += 1;
        }
        break;
      case "left":
        if (!gameView.cells[this.col][this.row].westWall) {
          this.col -= 1;
        } 
        break;
      case "right":
        if (!gameView.cells[this.col][this.row].eastWall) {
          this.col += 1;
        }
        break;
    }
  }
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      if (!gameView.cells[player.col][player.row].westWall) {
        player.col -= 1;
        redrawRequired = true;
      }
      break;
    case 39:
    case 68:
      if (!gameView.cells[player.col][player.row].eastWall) {
        player.col += 1;
        redrawRequired = true;
      }
      break;
    case 40:
    case 83:
      if (!gameView.cells[player.col][player.row].southWall) {
        player.row += 1;
        redrawRequired = true;
      }
      break;
    case 38:
    case 87:
      if (!gameView.cells[player.col][player.row].northWall) {
        player.row -= 1;
        redrawRequired = true;
      }
      break;
    case 98:
      player.shootDown();
      break;
    case 100:
      player.shootLeft();
      break;
    case 102:
      player.shootRight();
      break;
    case 104:
      player.shootUp();
      break;
    default:
      break;
  }
  if (player.row === 8 && player.col === 8) {
    var messageField = document.getElementById('message');
    if(level < 3){
      if(enemies.length === 0){
        player = new Player();
        level++;
        for(var i = 0; i < level; i++){
          var enemy = new Enemy();
          enemies.push(enemy);
        }
        messageField.innerHTML = "Level "+level;
        gameView.generate();
      } else {
        messageField.innerHTML = "Shoot all the enemies before entering next level!";
      }
    } else {
      if(enemies.length === 0){ 
      messageField.innerHTML = "Finished! Refresh to start again";
      endGame();
      } else {
        messageField.innerHTML = "Shoot all the enemies before finishing the game!";
      }
    }
  }
}

function endGame(){
  clearInterval(interval);
  canvas.remove();
}

function onLoad() {
  var messageField = document.getElementById('message');
  messageField.innerHTML = "Level "+level;
  canvas = document.getElementById("mainForm");
  ctx = canvas.getContext("2d");

  player = new Player();
  gameView = new GameView(9, 9, 50);
  enemies.push(new Enemy());
  console.log(enemies);
  gameView.generate();

  document.addEventListener("keydown", onKeyDown);
  interval = setInterval(() => gameView.refresh(), 100);
}
