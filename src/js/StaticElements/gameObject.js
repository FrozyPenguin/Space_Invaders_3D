import * as THREE from '../../lib/Three.js/build/three.module.js';
import { GLTFLoader } from '../../lib/Three.js/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../scene.js';

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

    loadNext() {
        if((this.models && this.models?.length < this.health && this.models instanceof Array && this.models?.length)
        || this.colors && this.colors?.length < this.health && this.colors instanceof Array && this.colors?.length) {
            throw `Config de ${this.constructor.name} invalide !`;
        }

        if(this.models?.length) {
            this.remove(...this.children);
            let model = this.models[this.maxModel - this.health];
            this.load(model.src)
            .then(() => {
                this.children.forEach(child => {
                    child.scale.x *= model.scale.x;
                    child.scale.y *= model.scale.y;
                    child.scale.z *= model.scale.z;
                    child.rotation.x = THREE.Math.degToRad(model.rotate.x);
                    child.rotation.y = THREE.Math.degToRad(model.rotate.y);
                    child.rotation.z = THREE.Math.degToRad(model.rotate.z);
                })
            })
            .catch(err => {
                console.error(err);
            });
        }
        else {
            this.children[0].material.color.setHex(parseInt(this.colors[this.maxModel - this.health]));
        }
    }

    setCollideGroup(group) {
        this.collideGroup = group;
    }
}