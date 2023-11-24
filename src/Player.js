import Bullet from './Bullet.js';
export default class Player {
    constructor(gameView) {
      this.col = 0;
      this.row = 0;
      this.bullets=[];
      this.gameView = gameView;
    }
  
    shootUp() {
      var bullet = new Bullet(this,0,this.gameView);
      this.bullets.push(bullet);
    }
    shootDown() {
      var bullet = new Bullet(this,1,this.gameView);
      this.bullets.push(bullet);
    }
    shootLeft() {
      var bullet = new Bullet(this,2,this.gameView);
      this.bullets.push(bullet);
    }
    shootRight() {
      var bullet = new Bullet(this,3,this.gameView);
      this.bullets.push(bullet);
    }
    
  }