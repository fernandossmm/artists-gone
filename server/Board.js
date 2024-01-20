
class Board {
    constructor(size) {
        this.size = size;
        this.board = Array(this.size.x).fill().map(()=>Array(this.size.y).fill());
    }

    claim(x, y, radius, id) {
        // X, Y and radius between 0 and 1
        gridX = this.size.x*x
        gridY = this.size.y*y
        gridRadius = this.size*radius;

        // Iterate through each grid point in the bounding box
        for (let i = Math.floor(gridX - gridRadius); i <= Math.ceil(gridX + gridRadius); i++) {
            for (let j = Math.floor(gridX - gridRadius); j <= Math.ceil(gridX + gridRadius); j++) {
                if(isPointInsideCircle(i, j, gridX, gridy, gridRadius)) {
                    this.board[i][j] = id
                }
            }
        }
    }
    
    isPointInsideCircle(x, y, centerX, centerY, radius) {
        return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
    }
}