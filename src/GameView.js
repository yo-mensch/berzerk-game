import Maze from './Maze.js';
import { getBackgroundColor, getBulletColor, getEnemyColor, getFinishColor, getPlayerColor } from './constants/Colors.js';

export default class GameView {
    constructor(cols, rows, canvas) {
      this.canvas = canvas;
      this.graphicsContext = canvas.getContext("2d");
      this.maze = new Maze(rows,cols);
      this.cols = cols;
      this.rows = rows;
      this.messageField = document.getElementById('message');
    }
  
    generate() {
      this.canvas.height = this.maze.height;
      this.canvas.width = this.maze.width;
      this.canvas.style.height = this.maze.height;
      this.canvas.style.width = this.maze.width;
  
      this.maze.generate();
      this.redraw();
    }
  
    redraw() {
      this.graphicsContext.fillStyle = getBackgroundColor();
      this.graphicsContext.fillRect(0, 0, this.maze.height, this.maze.width);
  
      this.graphicsContext.fillStyle = getFinishColor();
      this.graphicsContext.fillRect(
        (this.cols - 1) * this.maze.cellSize,
        (this.rows - 1) * this.maze.cellSize,
        this.maze.cellSize,
        this.maze.cellSize
      );
  
      this.graphicsContext.strokeStyle = this.mazeColor;
      this.graphicsContext.strokeRect(0, 0, this.maze.height, this.maze.width);
  
      for (let col = 0; col < this.cols; col++) {
        for (let row = 0; row < this.rows; row++) {
          if (this.maze.cells[col][row].eastWall) {
            this.graphicsContext.beginPath();
            this.graphicsContext.moveTo((col + 1) * this.maze.cellSize, row * this.maze.cellSize);
            this.graphicsContext.lineTo((col + 1) * this.maze.cellSize, (row + 1) * this.maze.cellSize);
            this.graphicsContext.stroke();
          }
          if (this.maze.cells[col][row].northWall) {
            this.graphicsContext.beginPath();
            this.graphicsContext.moveTo(col * this.maze.cellSize, row * this.maze.cellSize);
            this.graphicsContext.lineTo((col + 1) * this.cellSize, row * this.maze.cellSize);
            this.graphicsContext.stroke();
          }
          if (this.maze.cells[col][row].southWall) {
            this.graphicsContext.beginPath();
            this.graphicsContext.moveTo(col * this.maze.cellSize, (row + 1) * this.maze.cellSize);
            this.graphicsContext.lineTo((col + 1) * this.maze.cellSize, (row + 1) * this.maze.cellSize);
            this.graphicsContext.stroke();
          }
          if (this.maze.cells[col][row].westWall) {
            this.graphicsContext.beginPath();
            this.graphicsContext.moveTo(col * this.maze.cellSize, row * this.maze.cellSize);
            this.graphicsContext.lineTo(col * this.maze.cellSize, (row + 1) * this.maze.cellSize);
            this.graphicsContext.stroke();
          }
        }
      }
    }
  
    drawPlayer(player) {
      this.graphicsContext.fillStyle = getPlayerColor();
      this.graphicsContext.beginPath();
      this.graphicsContext.arc(
        player.col * this.maze.cellSize + 25,
        player.row * this.maze.cellSize + 25,
        10,
        0,
        2 * Math.PI,
        true
      );
      this.graphicsContext.closePath();
      this.graphicsContext.fill();
    }
  
    drawBullets(allBullets) {
      for (var i = 0; i < allBullets.length; i++) {
        this.drawBullet(allBullets[i]);
      }
    }
  
    drawEnemies(enemies){
      for (var i = 0; i < enemies.length; i++){
        this.drawEnemy(enemies[i]);
      }
    }
  
    drawBullet(bullet){
      this.graphicsContext.fillStyle = getBulletColor();
      this.graphicsContext.beginPath();
      this.graphicsContext.arc(
        bullet.x * this.maze.cellSize + 25,
        bullet.y * this.maze.cellSize + 25,
        5,
        0,
        2 * Math.PI,
        true
      );
      this.graphicsContext.closePath();
      this.graphicsContext.fill();
    }
  
    drawEnemy(enemy){
      this.graphicsContext.fillStyle = getEnemyColor();
      this.graphicsContext.beginPath();
      this.graphicsContext.arc(
        enemy.col * this.maze.cellSize + 25,
        enemy.row * this.maze.cellSize + 25,
        10,
        0,
        2 * Math.PI,
        true
      );
      this.graphicsContext.closePath();
      this.graphicsContext.fill();
    }
  
    setMessage(message){
      this.messageField.innerHTML = message;
    }

    getMessage(){
        return this.messageField.innerHTML;
    }
  }