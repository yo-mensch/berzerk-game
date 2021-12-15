export default class MazeCell {
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