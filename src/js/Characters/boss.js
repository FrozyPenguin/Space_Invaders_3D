import { Invader } from "./invaders.js";

class Boss extends Invader {
    // Quand le boss tire il doit précis
    // Pour déterminer le tire soit raycatser
    // Soit on fait une bounding box sur le defender et le boss et on compare le min et le max de la box3 en ajoutant des offsets et si on est dedans alors on tire

    constructor(size, localConfig, initPos, target) {
        super(size, 0, localConfig, target);
        this.name = "Boss";
        this.canMove = false;
        this.initPos = initPos;
        this.speed = localConfig.speed;
        this.loop = true;
        this.reset();
        this.probToShoot = 1;
        this.accuracy = 100;
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

                super.update(delta);
            }
            else {
                this.loop = false;
                setTimeout(() => {
                    setTimeout(() => {
                        this.canMove = true;
                        this.loop = true;
                        this.visible = true;
                    }, Math.random() * this.localConfig.maxTimeBeforeReapearing);
                }, this.localConfig.timeBeforeFirstMove);
            }
        }
    }

    death() {
        console.log('%cdeath', 'color: orange; font-weight: bold');

        setTimeout(() => {
            console.log('%cAlive', 'color: orange; font-weight: bold');
            this.live(this.maxModel);
            this.reset();
        }, Math.random() *  this.localConfig.maxTimeBeforeRevive);

        return super.death();
    }
}

export {
    Boss
}