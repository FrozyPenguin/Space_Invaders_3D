import * as THREE from '../../lib/Three.js/build/three.module.js';
import { GLTFLoader } from '../../lib/Three.js/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../scene.js';
import global from '../global.js';

export class GameObject extends THREE.Group {
    constructor(geometry, material) {
        super();
        if(geometry && material)
            this.add(new THREE.Mesh(geometry, material));
    }

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

    load(model) {
        return new Promise((resolse, reject) => {
            const loader = new GLTFLoader();

            loader.load(model,
            (gltf) => { // loaded
                this.add(...gltf.scene.children);
                resolse();
            },
            () => { // onload

            },
            (err) => {
                reject(err);
            })
        });
    }
}