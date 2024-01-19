class Player {
  constructor(id, x, y, radius) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = 0.002;
  }

  move(direction) {
    if(direction != null) {
      
      let length = Math.sqrt(direction.x*direction.x+direction.y*direction.y)

      this.x += direction.x/length * this.speed
      this.y += direction.y/length * this.speed
    }
  }
}

module.exports = Player;