import MazeCell from './MazeCell.js';

export default class Maze {
    constructor(rows, cols){
        this.cellSize = 50;
        this.rows = rows;
        this.cols = cols;
        this.width = rows * this.cellSize;
        this.height = cols * this.cellSize;
        this.cells=[];
    }

    generate(){
        this.setMazeCells();

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
    }

    setMazeCells() {
        for (let col = 0; col < this.cols; col++) {
            this.cells[col] = [];
            for (let row = 0; row < this.rows; row++) {
                this.cells[col][row] = new MazeCell(col, row);
            }
        }
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
}