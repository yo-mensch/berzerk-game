import getDirections from "./constants/Directions.js";

export default class Enemy {
    constructor(gameView){
      this.row = Math.floor(Math.random() * 9);
      this.col = Math.floor(Math.random() * 9);
      this.gameView = gameView;
    }
  
    move(){
      var direction = getDirections()[Math.floor(Math.random()*4)];
      switch(direction){
        case "up":
          if (!this.gameView.maze.cells[this.col][this.row].northWall) {
            this.row -= 1;
          }
          break;
        case "down":
          if (!this.gameView.maze.cells[this.col][this.row].southWall) {
            this.row += 1;
          }
          break;
        case "left":
          if (!this.gameView.maze.cells[this.col][this.row].westWall) {
            this.col -= 1;
          } 
          break;
        case "right":
          if (!this.gameView.maze.cells[this.col][this.row].eastWall) {
            this.col += 1;
          }
          break;
      }
    }
  }
  