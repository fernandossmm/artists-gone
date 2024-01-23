class PowerUp {
    static POWERUP_FREQUENCY = 20;
    static POWERUP_PERSISTENCE = 500;
    static POWERUP_DURATION = 180;

    static powerUpTypes = {
        speedUp: "speedUp",
        sizeUp: "sizeUp"
    };

    constructor(x, y, type, persistence, duration) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.factor = 1.5;
        this.persistence = persistence;
        this.duration = duration;
        this.remove = false;
    }

    update() {
        this.duration -= 1;
        
        if(this.duration <= 0)
        this.remove = true;
    }
}

module.exports = PowerUp;