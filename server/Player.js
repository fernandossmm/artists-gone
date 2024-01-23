class Player {
  constructor(id, number, name, x, y, radius, color) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 0.005;
    this.initialRadius = 0.05;
    this.powerUps = [];
    
    this.ready = false;
  }
  
  applyPowerup(powerUp) {
    switch(powerUp.type) {
      case powerUpTypes.speedUp:
        this.speed *= 1.2;
        break;
    }
    this.powerUps.push(powerUp);
  }
  
  removePowerUp(powerUp) {
    switch(powerUp.type) {
      case powerUpTypes.speedUp:
        this.speed /= 1.2;
        break;
    }
    this.powerUps = this.powerUps.filter(item => item !== powerUp);
  }
  
  update() {
    for(let powerUp in powerUps) {
      powerUp.update();
    }
  }

  move(direction) {
    if(direction != null) {
      let length = Math.sqrt(direction.x*direction.x+direction.y*direction.y);
      if(length >= this.radius/10) {
        this.x += direction.x/length * this.speed;
        this.y += direction.y/length * this.speed;
        this.x = Math.min(Math.max(this.radius*0.9, this.x), 1-this.radius*0.9);
        this.y = Math.min(Math.max(this.radius*0.9, this.y), 1-this.radius*0.9);
      }
    }
  }
}

class PowerUp {
  constructor(type, duration) {
    this.type = type;
    this.duration = duration;
    this.remove = false;
  }
  
  update() {
    this.duration -= 1;
    
    if(this.duration <= 0)
      this.remove = true;
  }
}

module.exports = Player, PowerUp;