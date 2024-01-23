class Player {
  constructor(player, splats) {
    this.id = player.id;
    this.number = player.number;
    this.name = player.name;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.color = player.color;
    this.image = splats[player.number%splats.length];
    this.speed = player.speed;
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

  update(player, splats) {
    this.number = player.number;
    this.name = player.name;
    this.x = player.x;
    this.y = player.y;
    this.radius = player.radius;
    this.speed = player.speed;
    this.image = splats[player.number%splats.length];
  }

  draw(board) {
    push();
    
    translate(board.x, board.y);
    scale(board.width*1.0, board.height*1.0);
    
    // fill(this.color.r, this.color.g, this.color.b);
    // strokeWeight(0.004);
    // circle(this.x, this.y, this.radius*2);
    
    image(this.image, this.x-this.radius*1.15, this.y-this.radius*1.5, this.radius*2.4, this.radius*2.8);
    pop();
  }
}
