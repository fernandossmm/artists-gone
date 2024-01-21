class Player {
  constructor(player, img) {
    this.id = player.id;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.color = player.color;
    this.image = img;
    this.speed = player.speed;
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
    //circle(this.x*WIDTH, this.y*HEIGHT, this.radius*WIDTH);
    var radiusX = this.radius*WIDTH*1.2;
    var radiusY = this.radius*HEIGHT*2.6;
    image(this.image, this.x*WIDTH-radiusX/2, this.y*HEIGHT-radiusY/2, radiusX, radiusY);
    pop();
  }
}
