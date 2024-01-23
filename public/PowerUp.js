class PowerUp {
    
    static powerUpTypes = {
        speedUp: "speedUp",
        sizeUp: "sizeUp"
    };

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.radius = 0.04;
        this.type = type;
        this.image = assets.get(this.type);
    }
    
    draw(board) {
        push();
        
        translate(board.x, board.y);
        scale(board.width, board.height);
        
        if(this.type == PowerUp.powerUpTypes.speedUp) {
            image(this.image, this.x-this.radius*1.4, this.y-this.radius, this.radius*2.8, this.radius*2);
        }
        else if(this.type == PowerUp.powerUpTypes.sizeUp) {
            image(this.image, this.x-this.radius*1.1, this.y-this.radius*0.85, this.radius*2.2, this.radius*2.3);
        }
        
        pop();
      }
}