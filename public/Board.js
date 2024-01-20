class Board {
    constructor(size) {
        this.size = size;
        this.board = Array(size.x).fill().map(()=>Array(size.y).fill());
    }
    
    update(board) {
        this.board = board;
    }
    
    claim(x, y, radius, id) {
        // X, Y and radius between 0 and 1
        let gridX = this.size.x*x
        let gridY = this.size.y*y
        let gridRadius = min(this.size.x, this.size.y)*radius;

        // Iterate through each grid point in the bounding box
        for (let i = Math.floor(gridX - gridRadius); i <= Math.ceil(gridX + gridRadius); i++) {
            for (let j = Math.floor(gridY - gridRadius); j <= Math.ceil(gridY + gridRadius); j++) {
                if( i>=0 && i<this.size.x &&
                    j>=0 && j<this.size.y &&
                    dist(i+0.5, j+0.5, gridX, gridY) < gridRadius) {
                    this.board[i][j] = id;
                }
            }
        }
    }
    
    isPointInsideCircle(x, y, centerX, centerY, radius) {
        return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
    }
    
    draw() {
        push();
        fill('#00FF00');
        noStroke();
        scale(WIDTH*1.0/this.size.x, HEIGHT*1.0/this.size.y);
        for(let i = 0; i < this.size.x; i++) {
            for(let j = 0; j < this.size.y; j++) {
                if(this.board[i][j] != null) {
                    rect(i, j, 1, 1);
                }
            }
        }
        pop();
    }
}