class Board {
    constructor(size) {
        this.size = size;
        this.board = Array(this.size.x).fill().map(()=>Array(this.size.y).fill());
    }

    claim(x, y, radius, id) {
        // X, Y and radius between 0 and 1
        let gridX = this.size.x*x
        let gridY = this.size.y*y
        let gridRadius = Math.min(this.size.x, this.size.y)*radius;

        // Iterate through each grid point in the bounding box
        for (let i = Math.floor(gridX - gridRadius); i <= Math.ceil(gridX + gridRadius); i++) {
            for (let j = Math.floor(gridY - gridRadius); j <= Math.ceil(gridY + gridRadius); j++) {
                if( i>=0 && i<this.size.x &&
                    j>=0 && j<this.size.y &&
                    this.isPointInsideCircle(i+0.5, j+0.5, gridX, gridY, gridRadius)) {
                    this.board[i][j] = id;
                }
            }
        }
    }
    
    isPointInsideCircle(x, y, centerX, centerY, radius) {
        return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
    }
}

module.exports = Board;