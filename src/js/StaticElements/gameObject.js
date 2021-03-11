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
        if(wall) return this.getBoundingBox().intersectsBox(wall.getBoundingBox());
        return false;
    }

    loadModel(model) {
        return new Promise((resolse, reject) => {
            const loader = new GLTFLoader();

            loader.load(model,
            (gltf) => { // loaded
                this.add(...gltf.scene.children);
                resolse();
            },
            () => { // onload

            },
            (err) => { // onErr
                reject(err);
            })
        });
    }

    loadAllModels() {
        return new Promise((resolse, reject) => {
            this.remove(...this.children);
            let loadPromises = [];
            this.models.forEach(model => {
                loadPromises.push(this.loadModel(model.src));
            })

            Promise.all(loadPromises)
            .then(() => {
                this.children.forEach((child, index) => {
                    child.scale.x *= this.models[index].scale.x;
                    child.scale.y *= this.models[index].scale.y;
                    child.scale.z *= this.models[index].scale.z;
                    child.rotation.x = THREE.Math.degToRad(this.models[index].rotate.x);
                    child.rotation.y = THREE.Math.degToRad(this.models[index].rotate.y);
                    child.rotation.z = THREE.Math.degToRad(this.models[index].rotate.z);

                    // Ignore le premier model
                    if(index) child.visible = false;
                    resolse();
                })
            })
            .catch(error => {
                reject(error);
            })
        })
    }

    loadNextModel() {
        if((this.models && this.models?.length < this.health && this.models instanceof Array && this.models?.length)
        || this.colors && this.colors?.length < this.health && this.colors instanceof Array && this.colors?.length) {
            throw `Config de ${this.constructor.name} invalide !`;
        }

        let indexToLoad = this.maxModel - this.health;

        if(this.models?.length) {
            if(this.children.length) {
                this.children.forEach((child, index) => {
                    if(index == indexToLoad) child.visible = true;
                    else child.visible = false;
                })
            }
            else {
                this.loadAllModels()
                .catch(error => {
                    throw error;
                })
            }
        }
        else {
            this.children[0].material.color.setHex(parseInt(this.colors[indexToLoad]));
        }
    }

    setCollideGroup(group) {
        this.collideGroup = group;
    }

    showSkeleton() {
        let skeletonGroup = scene.getObjectByName('Skeletons');
        if(skeletonGroup) {
            let actualModelIndex = this.models ? this.maxModel - this.health : 0;
            const skeletonHelper = new THREE.SkeletonHelper(this.children[actualModelIndex]);
            skeletonGroup.add(skeletonHelper);
        }
    }

    showBox() {
        let boxGroup = scene.getObjectByName('Hit Boxes');
        if(boxGroup) {
            // Add a box helper.
            const boxHelper = new THREE.BoxHelper(this, new THREE.Color(0xFF0000));
            boxGroup.add(boxHelper);
        }
    }
}