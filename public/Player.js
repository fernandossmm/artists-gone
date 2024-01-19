class Player {
  constructor(player) {
    this.id = player.id;
    this.instrument = player.instrument;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.speed = player.speed;
  }

  update(player) {
    this.instrument = player.instrument;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.speed = player.speed;
  }

  draw() {
    fill('orange')
    circle(this.x*WIDTH, this.y*HEIGHT, this.radius*WIDTH)
  }
}
