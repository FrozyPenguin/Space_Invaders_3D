import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { scene } from '../scene.js';

class Bonus extends THREE.Mesh {
    constructor() {

        scene.add(this);
    }

    setVelocity(vel) {
        this.vel = vel;
    }

    // Quand on collide on le détruit
    collide() {

    }

    update(delta) {
        this.position.z += this.vel * delta;
    }
}

export {
    Bonus
}