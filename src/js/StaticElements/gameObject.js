import * as THREE from '../../lib/Three.js/build/three.module.js';
import { scene } from '../scene.js';

export class GameObject extends THREE.Mesh {
    getBoundingBox() {
        return new THREE.Box3().setFromObject(this);
    }

    isCollidingWall(wallName) {
        let wall = scene.getObjectByName(`${wallName}Wall`);
        if(wall) {
            let wallBoundingBox = new THREE.Box3().setFromObject(wall);

            return this.getBoundingBox().intersectsBox(wallBoundingBox);
        }
        return false;
    }
}