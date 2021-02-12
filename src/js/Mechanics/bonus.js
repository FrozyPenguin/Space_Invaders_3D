import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { scene } from '../scene.js';

class Bonus extends THREE.Mesh {
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