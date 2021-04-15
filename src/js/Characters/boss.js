import { Invader } from "./invaders.js";

class Boss extends Invader {
    // Quand le boss tire il doit précis
    // Pour déterminer le tire soit raycatser
    // Soit on fait une bounding box sur le defender et le boss et on compare le min et le max de la box3 en ajoutant des offsets et si on est dedans alors on tire

    constructor(size, localConfig, initPos, target) {
        super(size, 0, localConfig);
        this.name = "Boss";
        this.target = target;
        this.canMove = false;
        this.initPos = initPos;
        this.speed = localConfig.speed;
        this.loop = true;
        this.reset();
    }

    reset() {
        this.visible = false;
        this.position.z = this.initPos / 2;
        this.position.x = this.initPos;
        this.speed.x = -Math.abs(this.speed.x);
    }

    update(delta) {
        if(this.loop) {
            if(this.canMove) {
                if(this.isCollidingWall('left')) {
                    this.speed.x = this.speed.x > 0 ? this.speed.x * -1 : this.speed.x;
                    this.canMove = false;
                    this.visible = false;
                }
                else if(this.isCollidingWall('right')) {
                    this.speed.x = this.speed.x < 0 ? this.speed.x * -1 : this.speed.x;
                    this.canMove = false;
                    this.visible = false;
                }

                this.position.x += delta * this.speed.x;

                // TODO: IA de tire
            }
            else {
                this.loop = false;
                setTimeout(() => {
                    setTimeout(() => {
                        this.canMove = true;
                        this.loop = true;
                        this.visible = true;
                    }, Math.random() * 10 * 1000);
                }, 5000);
            }
        }
    }

    death() {
        console.log('%cdeath', 'color: orange; font-weight: bold');

        setTimeout(() => {
            console.log('%cAlive', 'color: orange; font-weight: bold');
            this.visible = true;
            this.reset();
        }, Math.random() * 30 * 1000);

        return super.death();
    }
}

export {
    Boss
}