class PowerUp {
    static POWERUP_FREQUENCY = 300;
    static POWERUP_PERSISTENCE = 300;
    static POWERUP_DURATION = 180;

    static powerUpTypes = {
        speedUp: "speedUp",
        sizeUp: "sizeUp",
        bomb: "bomb"
    };

    constructor(x, y, type, persistence, duration) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.factor = 1.5;
        this.persistence = persistence; // Horrible name
        this.duration = duration;
        this.remove = false;
    }

    reducePersistence() {
        this.persistence -= 1;
        
        if(this.persistence <= 0)
            this.remove = true;
    }

    reduceDuration() {
        this.duration -= 1;
        
        if(this.duration <= 0)
            this.remove = true;
    }
}

module.exports = PowerUp;