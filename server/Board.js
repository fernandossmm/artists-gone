let PowerUp = require("./PowerUp");

class Board {
    constructor(size) {
        this.size = size;
        this.board = Array(this.size.x).fill().map(()=>Array(this.size.y).fill());
        
        this.powerUps = [];
    }

    claim(player, x, y, radius) {
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
                    this.board[i][j] = player.id;
                }
            }
        }
        
        for(let powerUp of this.powerUps) {
            if(this.isPointInsideCircle(powerUp.x, powerUp.y, player.x, player.y, player.radius)) {
                player.applyPowerup(powerUp);
                this.powerUps = this.powerUps.filter(item => item !== powerUp);
            }
        }
    }
    
    spawnRandomPowerUp() {
        let types = Array.from(Object.keys(PowerUp.powerUpTypes));
        let rand = Math.floor(Math.random()*types.length);
        let type = PowerUp.powerUpTypes[types[rand]];
        
        let powerUp = new PowerUp(
            Math.random(),
            Math.random(),
            type,
            PowerUp.POWERUP_PERSISTENCE,
            PowerUp.POWERUP_DURATION
        )
        this.powerUps.push(powerUp);
    }
    
    calculateScores() {
        let scores = new Map();
        
        for(let i = 0; i < this.size.x; i++) {
            for(let j = 0; j < this.size.y; j++) {
                let id = this.board[i][j];
                if(id != null) {
                    if(scores.has(id)) {
                        scores.set(id, scores.get(id)+1);
                    }
                    else {
                        scores.set(id, 1);
                    }
                }
            }
        }
        
        for(let id of scores.keys()) {
            scores.set(id, scores.get(id)*1.0 / (this.size.x*this.size.y));
        }
        
        return scores;
    }
    
    isPointInsideCircle(x, y, centerX, centerY, radius) {
        return Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
    }
}

module.exports = Board;