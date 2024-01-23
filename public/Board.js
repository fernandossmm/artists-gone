class Board {
    constructor(size, x, y, width, height) {
        this.size = size;
        this.board = Array(size.x).fill().map(()=>Array(size.y).fill());
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.powerUps = [];
    }
    
    update(board) {
        this.board = board;
    }
    
    updatePowerUps(powerUps) {
        this.powerUps = [];
        for(let powerUp of powerUps) {
            this.powerUps.push(new PowerUp(powerUp.x, powerUp.y, powerUp.type));
        }
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
                    dist(i+0.5, j+0.5, gridX, gridY) < gridRadius) {
                    this.board[i][j] = id;
                }
            }
        }
    }
    
    draw(colormap) {
        push();
        var ids = colormap.keys();
        strokeWeight(0.05);
        translate(this.x, this.y);
        scale(this.width*1.0/this.size.x, this.height*1.0/this.size.y);
        
        for(let id of ids) {
            let color = colormap.get(id);
            fill(color.r, color.g, color.b);
            stroke(color.r, color.g, color.b);
            if(color != undefined) {
                for(let i = 0; i < this.size.x; i++) {
                    for(let j = 0; j < this.size.y; j++) {
                        if(this.board[i][j] == id)
                            rect(i, j, 1, 1);
                    }
                }
            }
        }
        pop();
        
        for(let powerUp of this.powerUps) {
            powerUp.draw(this);
        }
    }
}