let ctx;
let canvas;
let gameView;
let mazeHeight;
let mazeWidth;
let player;
let level = 1;
let redrawRequired = false;
let allBullets = [];
let defaultBulletSpeed = 20;

class Bullet{
  constructor(){
    this.x = player.col*gameView.cellSize + 25;
    this.y = player.row*gameView.cellSize + 25;
    this.width = 50;
    this.height = 50;
    this.speed = 25;
  }
}

class Player {

  constructor() {
    this.col = 0;
    this.row = 0;
  }

  shootUp(playerRow, playerCol,n){
      ctx.fillStyle = gameView.bulletColor;
      ctx.beginPath();
      ctx.arc((1 * gameView.cellSize)+25, (1 * gameView.cellSize)+25, 5, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      console.log("i tried to draw");
      //maze.redraw();
  }
  shootDown(playerXCoord, playerYCoord){
    
  }
  shootLeft(playerXCoord, playerYCoord){
    
  }
  shootRight(playerXCoord, playerYCoord){

  }
  shootSW(playerXCoord, playerYCoord){

  }
  shootSE(playerXCoord, playerYCoord){

  }
  shootNE(playerXCoord, playerYCoord){

  }
  shootNW(playerXCoord, playerYCoord){

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
              if (currCell.col !== (this.cols - 1) && !this.cells[currCell.col + 1][currCell.row].visited) {
                currCell.eastWall = false;
                nextCell = this.cells[currCell.col + 1][currCell.row];
                nextCell.westWall = false;
                foundNeighbor = true;
              }
              break;
            case 1:
              if (currCell.row !== 0 && !this.cells[currCell.col][currCell.row - 1].visited) {
                currCell.northWall = false;
                nextCell = this.cells[currCell.col][currCell.row - 1];
                nextCell.southWall = false;
                foundNeighbor = true;
              }
              break;
            case 2:
              if (currCell.row !== (this.rows - 1) && !this.cells[currCell.col][currCell.row + 1].visited) {
                currCell.southWall = false;
                nextCell = this.cells[currCell.col][currCell.row + 1];
                nextCell.northWall = false;
                foundNeighbor = true;
              }
              break;
            case 3:
              if (currCell.col !== 0 && !this.cells[currCell.col - 1][currCell.row].visited) {
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
        } while (!foundNeighbor)
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
    return ((mazeCell.col !== 0               && !this.cells[mazeCell.col - 1][mazeCell.row].visited) ||
            (mazeCell.col !== (this.cols - 1) && !this.cells[mazeCell.col + 1][mazeCell.row].visited) ||
            (mazeCell.row !== 0               && !this.cells[mazeCell.col][mazeCell.row - 1].visited) ||
            (mazeCell.row !== (this.rows - 1) && !this.cells[mazeCell.col][mazeCell.row + 1].visited));
  }

  refresh(){
    if(redrawRequired){
      this.redraw();
      redrawRequired = false;
    }
  }

  redraw() {

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, mazeHeight, mazeWidth);

    ctx.fillStyle = this.endColor;
    ctx.fillRect((this.cols - 1) * this.cellSize, (this.rows - 1) * this.cellSize, this.cellSize, this.cellSize);

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
    //this.drawBullet();
  }


  drawPlayer() {
        ctx.fillStyle = this.playerColor;
        ctx.beginPath();
        ctx.arc((player.col * this.cellSize) + 25, (player.row * this.cellSize) + 25, 10, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
  }

  drawBullet(){
    ctx.fillStyle = this.bulletColor;
      ctx.beginPath();
      ctx.arc((1 * this.cellSize)+25, (1 * this.cellSize)+25, 5, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
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
    case 97:
      console.log("shooting diagonally to south left")
      break;
    case 98:
      break;
    case 99:
      break;
    case 100:
      break;
    case 102:
      break;
    case 103:
      break;
    case 104:
      player.shootUp(player.row, player.col, -1);
      break;
    case 105:
      break;
    default:
      break;
  }
  if(player.row===8&&player.col===8){
      player = new Player();
      level++;
      gameView.generate();
      console.log(level);
  }

}

function onLoad() {
  console.log(level);
  canvas = document.getElementById("mainForm");
  ctx = canvas.getContext("2d");

  player = new Player();
  gameView = new GameView(9, 9, 50);
  gameView.generate();

  document.addEventListener("keydown", onKeyDown);
  setInterval( () => gameView.refresh(), 100);

}
