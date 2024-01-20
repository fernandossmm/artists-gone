class Player {
  constructor(player) {
    this.id = player.id;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.color = player.color;
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
    push();
    fill(this.color.r, this.color.g, this.color.b);
    circle(this.x*WIDTH, this.y*HEIGHT, this.radius*WIDTH);
    pop();
  }
}
