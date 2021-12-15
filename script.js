import Maze from './src/Maze.js';
import getDirections from './src/constants/Directions.js';
import { getBackgroundColor, getBulletColor, getEnemyColor, getFinishColor, getPlayerColor, getWallColor } from './src/constants/Colors.js';

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

class GameView {
  constructor(cols, rows) {
    this.maze = new Maze(9,9);
    this.cols = cols;
    this.rows = rows;

    this.cells = [];
  }

  generate() {
    canvas.height = this.maze.height;
    canvas.width = this.maze.width;
    canvas.style.height = mazeHeight;
    canvas.style.width = mazeWidth;

    this.maze.generate();
    this.redraw();
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
    ctx.fillStyle = getBackgroundColor();
    ctx.fillRect(0, 0, this.maze.height, this.maze.width);

    ctx.fillStyle = getFinishColor();
    ctx.fillRect(
      (this.cols - 1) * this.maze.cellSize,
      (this.rows - 1) * this.maze.cellSize,
      this.maze.cellSize,
      this.maze.cellSize
    );

    ctx.strokeStyle = this.mazeColor;
    ctx.strokeRect(0, 0, this.maze.height, this.maze.width);

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        if (this.maze.cells[col][row].eastWall) {
          ctx.beginPath();
          ctx.moveTo((col + 1) * this.maze.cellSize, row * this.maze.cellSize);
          ctx.lineTo((col + 1) * this.maze.cellSize, (row + 1) * this.maze.cellSize);
          ctx.stroke();
        }
        if (this.maze.cells[col][row].northWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.maze.cellSize, row * this.maze.cellSize);
          ctx.lineTo((col + 1) * this.cellSize, row * this.maze.cellSize);
          ctx.stroke();
        }
        if (this.maze.cells[col][row].southWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.maze.cellSize, (row + 1) * this.maze.cellSize);
          ctx.lineTo((col + 1) * this.maze.cellSize, (row + 1) * this.maze.cellSize);
          ctx.stroke();
        }
        if (this.maze.cells[col][row].westWall) {
          ctx.beginPath();
          ctx.moveTo(col * this.maze.cellSize, row * this.maze.cellSize);
          ctx.lineTo(col * this.maze.cellSize, (row + 1) * this.maze.cellSize);
          ctx.stroke();
        }
      }
    }
    this.drawPlayer();
    this.drawBullets();
    this.drawEnemies();
  }

  drawPlayer() {
    ctx.fillStyle = getPlayerColor();
    ctx.beginPath();
    ctx.arc(
      player.col * this.maze.cellSize + 25,
      player.row * this.maze.cellSize + 25,
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
      this.drawBullet(allBullets[i]);
    }
  }

  drawEnemies(){
    for (var i = 0; i < enemies.length; i++){
      this.drawEnemy(enemies[i]);
    }
  }

  drawBullet(bullet){
    ctx.fillStyle = getBulletColor();
    ctx.beginPath();
    ctx.arc(
      bullet.x * gameView.maze.cellSize + 25,
      bullet.y * gameView.maze.cellSize + 25,
      5,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }

  drawEnemy(enemy){
    ctx.fillStyle = getEnemyColor();
    ctx.beginPath();
    ctx.arc(
      enemy.col * gameView.maze.cellSize + 25,
      enemy.row * gameView.maze.cellSize + 25,
      10,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }
}

class Bullet {
  constructor(bulletDirectionIndex) {
    this.bulletDirection = getDirections()[bulletDirectionIndex];
    this.x = player.col;
    this.y = player.row;
    this.hasHit = false;
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
    if (!gameView.maze.cells[this.x][this.y].westWall) {
      this.x -= 1;
    } else {
      this.hasHit = true;
    }
  }

  moveRight() {
    if (!gameView.maze.cells[this.x][this.y].eastWall) {
      this.x += 1;
    } else {
      this.hasHit = true;
    }
  }

  moveUp() {
    if (!gameView.maze.cells[this.x][this.y].northWall) {
      this.y -= 1;
    } else {
      this.hasHit = true;
    }
  }

  moveDown() {
    if (!gameView.maze.cells[this.x][this.y].southWall) {
      this.y += 1;
    } else {
      this.hasHit = true;
    }
  }
}

class Enemy {
  constructor(){
    this.row = Math.floor(Math.random() * 9);
    this.col = Math.floor(Math.random() * 9);
  }

  move(){
    var direction = getDirections()[Math.floor(Math.random()*4)];
    switch(direction){
      case "up":
        if (!gameView.maze.cells[this.col][this.row].northWall) {
          this.row -= 1;
        }
        break;
      case "down":
        if (!gameView.maze.cells[this.col][this.row].southWall) {
          this.row += 1;
        }
        break;
      case "left":
        if (!gameView.maze.cells[this.col][this.row].westWall) {
          this.col -= 1;
        } 
        break;
      case "right":
        if (!gameView.maze.cells[this.col][this.row].eastWall) {
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
      if (!gameView.maze.cells[player.col][player.row].westWall) {
        player.col -= 1;
        redrawRequired = true;
      }
      break;
    case 39:
    case 68:
      if (!gameView.maze.cells[player.col][player.row].eastWall) {
        player.col += 1;
        redrawRequired = true;
      }
      break;
    case 40:
    case 83:
      if (!gameView.maze.cells[player.col][player.row].southWall) {
        player.row += 1;
        redrawRequired = true;
      }
      break;
    case 38:
    case 87:
      if (!gameView.maze.cells[player.col][player.row].northWall) {
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
      messageField.innerHTML = "Finished! Refresh to start again";
      endGame();
    }
  }
}

function endGame(){
  clearInterval(interval);
  canvas.remove();
}

window.onLoad = function onLoad() {
  var messageField = document.getElementById('message');
  messageField.innerHTML = "Level "+level;
  canvas = document.getElementById("mainForm");
  ctx = canvas.getContext("2d");

  player = new Player();
  gameView = new GameView(9, 9);
  enemies.push(new Enemy());
  gameView.generate();

  document.addEventListener("keydown", onKeyDown);
  interval = setInterval(() => gameView.refresh(), 100);
}
