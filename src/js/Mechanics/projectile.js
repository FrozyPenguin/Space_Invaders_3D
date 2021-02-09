import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { scene } from '../scene.js';

class Projectile extends THREE.Mesh {
    constructor(width, depth, height, color, sender) {
        const projectileGeometry = new THREE.BoxBufferGeometry(width, height, depth);
        const projectileMaterial = new THREE.MeshBasicMaterial({ color: color });
        super(projectileGeometry, projectileMaterial)

        this.vel;
        this.position.set(sender.position.x, sender.position.y, sender.position.z);

        this.sender = sender;

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
    Projectile
}