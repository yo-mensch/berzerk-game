import GameView from "./GameView.js";
import Player from './Player.js';
import Enemy from "./Enemy.js";
export default class Game{
    constructor(){
        this.canvas = document.getElementById("mainForm");
        this.enemies = [];
        this. interval = null;
        this.redrawRequired = false;
        this.gameView = new GameView(9, 9, this.canvas);
        this.player = null;
        this.level = 1;
    }
    refresh() {
        this.refreshBullets();
        this.refreshEnemies();
        if (this.redrawRequired) {
          this.gameView.redraw();
          this.gameView.drawPlayer(this.player);
          this.gameView.drawEnemies(this.enemies);
          this.gameView.drawBullets(this.player.bullets);
          this.redrawRequired = false;
        }
        this.checkPlayerPosition();
      }
    refreshBullets() {
        var i = 0;
        var currentBullet;
        while (i < this.player.bullets.length) {
          currentBullet = this.player.bullets[i];
          if (currentBullet.hasHit) {
            this.player.bullets.splice(i, 1);
          } else {
            currentBullet.move();
            i += 1;
          }
          this.redrawRequired = true;
        }
    }
    refreshEnemies(){
        var i = 0;
        var currentEnemy;
        while(i < this.enemies.length) {
          currentEnemy = this.enemies[i];
          if(currentEnemy.row === this.player.row && currentEnemy.col === this.player.col){
            this.gameView.setMessage("You got killed by an enemy! Refresh to start the game");-
            this.endGame();
          }
          for(var j = 0; j < this.player.bullets.length; j++) {
            if(this.player.bullets[j].x === currentEnemy.col && this.player.bullets[j].y === currentEnemy.row){
              this.enemies.splice(i, 1);
              this.player.bullets.splice(j, 1);
              break;
            }
          }
          currentEnemy.move();
          i += 1;
        }
        this.redrawRequired = true;
    }

    checkPlayerPosition(){
      if(this.player.row === 8 && this.player.col === 8){
        this.checkFinish();
      }
    }

    checkFinish(){
      if(this.level < 3){
        if(this.enemies.length === 0){
          this.levelUp();
        } else {
          this.gameView.setMessage("Shoot all the enemies before entering next level!");
        }
      } else {
        this.gameView.setMessage("Finished! Refresh to start again");
        this.endGame();
      }
    }

    levelUp(){
      this.player = new Player(this.gameView);
      this.level++;
      for(var i = 0; i < this.level; i++){
        this.enemies.push(new Enemy(this.gameView));
      }
      document.addEventListener('keydown',this.onKeyDown.bind(event,this.player));
      this.gameView.setMessage("Level "+this.level);
      this.gameView.generate();
    }

    onKeyDown(player,event){
      switch (event.keyCode) {
        case 37:
        case 65:
          if (!player.gameView.maze.cells[player.col][player.row].westWall) {
            player.col -= 1;
          }
          break;
        case 39:
        case 68:
          if (!player.gameView.maze.cells[player.col][player.row].eastWall) {
            player.col += 1;
          }
          break;
        case 40:
        case 83:
          if (!player.gameView.maze.cells[player.col][player.row].southWall) {
            player.row += 1;
          }
          break;
        case 38:
        case 87:
          if (!player.gameView.maze.cells[player.col][player.row].northWall) {
            player.row -= 1;
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
    }

    startGame(){
      this.player = new Player(this.gameView);
      this.enemies.push(new Enemy(this.gameView));
      this.gameView.setMessage("Level "+this.level);
      this.gameView.generate();
      
      document.addEventListener('keydown',this.onKeyDown.bind(event,this.player));
      this.interval = setInterval(()=>this.refresh(),100);
    }
      
    endGame(){
        clearInterval(this.interval);
        this.canvas.remove();
    }
}