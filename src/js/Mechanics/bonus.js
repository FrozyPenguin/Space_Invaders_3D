import * as THREE from '../../lib/Three.js/build/three.module.js';
import { scene } from '../scene.js';
import { GameObject } from '../StaticElements/gameObject.js';

// TODO: faire les bonus
class Bonus extends GameObject {
    /**
     * Constructeur d'un bonus
     */
    constructor() {

        scene.add(this);
    }

    /**
     * Définie la vitesse de chute du bonus
     * @param { Number } vel vitesse de chute
     */
    setVelocity(vel) {
        this.vel = vel;
    }

    // Quand on collide on le détruit
    collide() {

    }

    /**
     * Fonction de mise a jour de l'élément
     * @param { Number } delta temps écoulé depuis la dérniere période d'horloge
     */
    update(delta) {
        this.position.z += this.vel * delta;
    }
}

export {
    Bonus
}