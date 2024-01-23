let PowerUp = require("./PowerUp");

class Player {
  constructor(id, number, name, x, y, radius, color) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 0.007;
    this.initialRadius = 0.05;
    this.powerUps = [];
    
    this.ready = false;
  }
  
  applyPowerup(powerUp) {
    if(powerUp.type == PowerUp.powerUpTypes.speedUp) {
      this.speed *= powerUp.factor;
    }
    else if(powerUp.type == PowerUp.powerUpTypes.sizeUp) {
      this.radius *= powerUp.factor;
    }
    this.powerUps.push(powerUp);
  }
  
  removePowerUp(powerUp) {
    if(powerUp.type == PowerUp.powerUpTypes.speedUp) {
      this.speed /= powerUp.factor;
    }
    else if(powerUp.type == PowerUp.powerUpTypes.sizeUp) {
      this.radius /= powerUp.factor;
    }
    
    this.powerUps = this.powerUps.filter(item => item !== powerUp);
  }
  
  update() {
    for(let powerUp of this.powerUps) {
      powerUp.reduceDuration();
      if(powerUp.remove) {
        this.removePowerUp(powerUp);
      }
    }
    
    let direction = this.direction;
    if(direction != undefined) {
      let length = Math.sqrt(direction.x*direction.x+direction.y*direction.y);
      if(length >= this.radius/10) {
        this.x += direction.x/length * this.speed;
        this.y += direction.y/length * this.speed;
        this.x = Math.min(Math.max(this.radius*0.9, this.x), 1-this.radius*0.9);
        this.y = Math.min(Math.max(this.radius*0.9, this.y), 1-this.radius*0.9);
      }
    }
  }

  move(direction) {
    if(direction != null) {
      this.direction = direction;
    }
  }
}

module.exports = Player;