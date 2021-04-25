import { Defender } from '../Characters/defender.js';
import { scene } from '../scene.js';
import { GameObject } from '../StaticElements/gameObject.js';

class Bonus extends GameObject {
    /**
     * Constructeur d'un bonus
     */
    constructor(position) {
        super();
        if (this.constructor === Bonus) {
            throw new TypeError('Abstract class "Bonus" cannot be instantiated directly');
        }

        this.vel = 150;

        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
        scene.add(this);
    }

    /**
     * Définie la vitesse de chute du bonus
     * @param { Number } vel vitesse de chute
     */
    setVelocity(vel) {
        this.vel = vel;
    }

    /**
     * Quand on rentre en collision avec le Defender, on lance l'effet
     */
    collide() {
        let actualCollideGroup = this.collideGroup.filter(element => element.visible);
        for (let i = 0; i < actualCollideGroup.length; i++) {
            const elementBox = actualCollideGroup[i].getBoundingBox();
            const element = actualCollideGroup[i];

            if(this.getBoundingBox().intersectsBox(elementBox)) {
                this.visible = false;

                if(element instanceof Defender) {
                    this.launchEffect();
                }

                this.toRemove = true;
            }
        }
    }

    launchEffect() {
        throw 'Effet non définie';
    }

    /**
     * Fonction de mise a jour de l'élément
     * @param { Number } delta temps écoulé depuis la dérniere période d'horloge
     */
    update(delta) {
        super.update(delta);
        this.position.z -= this.vel * delta;
        this.collide();
    }
}

export {
    Bonus
}