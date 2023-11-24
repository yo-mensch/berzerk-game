import getDirections from './constants/Directions.js';
export default class Bullet {
    constructor(player,bulletDirectionIndex, gameView) {
      this.bulletDirection = getDirections()[bulletDirectionIndex];
      this.x = player.col;
      this.y = player.row;
      this.hasHit = false;
      this.gameView = gameView;
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
      if (!this.gameView.maze.cells[this.x][this.y].westWall) {
        this.x -= 1;
      } else {
        this.hasHit = true;
      }
    }
  
    moveRight() {
      if (!this.gameView.maze.cells[this.x][this.y].eastWall) {
        this.x += 1;
      } else {
        this.hasHit = true;
      }
    }
  
    moveUp() {
      if (!this.gameView.maze.cells[this.x][this.y].northWall) {
        this.y -= 1;
      } else {
        this.hasHit = true;
      }
    }
  
    moveDown() {
      if (!this.gameView.maze.cells[this.x][this.y].southWall) {
        this.y += 1;
      } else {
        this.hasHit = true;
      }
    }
  }