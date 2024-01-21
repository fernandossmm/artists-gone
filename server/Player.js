class Player {
  constructor(id, x, y, radius, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 0.004;
    this.initialRadius = 0.05;
    
    this.ready = false;
  }

  move(direction) {
    if(direction != null) {
      let length = Math.sqrt(direction.x*direction.x+direction.y*direction.y)
      if(length >= this.radius/10) {
        this.x += direction.x/length * this.speed;
        this.y += direction.y/length * this.speed;
      }
    }
  }
}

module.exports = Player;