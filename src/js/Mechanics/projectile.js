import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { scene } from '../scene.js';

class Projectile extends THREE.Mesh {
    /**
     * Constructeur du projectile
     * @param { Number } width largeur du projectile
     * @param { Number } depth profondeur du projectile
     * @param { Number } height hauteur du projectile
     * @param { String } color couleur du projectile
     * @param { THREE.Mesh } sender émetteur du projectile
     */
    constructor(width, depth, height, color, sender) {
        const projectileGeometry = new THREE.BoxBufferGeometry(width, height, depth);
        const projectileMaterial = new THREE.MeshBasicMaterial({ color: color });
        super(projectileGeometry, projectileMaterial)

        this.vel;
        this.position.set(sender.position.x, sender.position.y, sender.position.z);

        this.sender = sender;

        scene.add(this);
    }

    /**
     * Définie la vitesse du projectile
     * @param { Number } vel vitesse du projectile
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
    Projectile
}