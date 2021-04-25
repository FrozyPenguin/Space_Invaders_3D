import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../scene.js';

export class GameObject extends THREE.Group {
    constructor(geometry, material) {
        super();

        if(geometry && material)
            this.add(new THREE.Mesh(geometry, material));

        this.loadedModel = [];
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
            const loader = new GLTFLoader()

            loader.load(model.src,
                (obj) => {
                    if(!(model.scale && model.scale != {})) model.scale = { x: 1, y: 1, z: 1 };
                    if(!(model.rotate && model.rotate != {})) model.rotate =  { x: 0, y: 0, z: 0 };

                    obj.scene.scale.x *= model.scale.x;
                    obj.scene.scale.y *= model.scale.y;
                    obj.scene.scale.z *= model.scale.z;
                    obj.scene.rotation.x = THREE.Math.degToRad(model.rotate.x);
                    obj.scene.rotation.y = THREE.Math.degToRad(model.rotate.y);
                    obj.scene.rotation.z = THREE.Math.degToRad(model.rotate.z);
                    obj.animated = model.animated;
                    this.loadedModel.push(obj);
                    resolse();
                },
                (xhr) => { // onProgress
                    // console.log((xhr.loaded / xhr.total * 100 ) + '% loaded');
                },
                (error) => { // onError
                    reject(error);
                }
            );
        });
    }

    loadAnimation(obj) {
        if(obj.animated) {
            this.animated = true;
            const animations = obj.animations;
            this.mixer = new THREE.AnimationMixer(obj.scene);

            const [ idleAnim ] = animations.filter(animation => animation.name == 'Idle');
            const [ actionAnim ] = animations.filter(animation => animation.name == 'Action');

            let idle = idleAnim ? this.mixer.clipAction(idleAnim) : null;
            let action = actionAnim ? this.mixer.clipAction(actionAnim) : null;

            this.actions = { idle, action };

            this.startAnimation('idle');
        }
    }

    startAnimation(name) {
        if(!this.animated) return;

        this.mixer.stopAllAction();

        const [ running ] = Object.values(this.actions).filter(action => action?.isRunning());

        const action = this.actions[name];
        action.reset();

        if(!action) throw 'Animation not exist';

        if(!running) action.play();
        else action.crossFadeFrom(running, 1);
    }

    loadAllModels() {
        return new Promise((resolse, reject) => {
            this.remove(...this.children);
            let loadPromises = [];
            this.models.forEach(model => {
                loadPromises.push(this.loadModel(model));
            })

            Promise.all(loadPromises)
            .then(() => {
                resolse();
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

            this.remove(...this.children);
            if(this.loadedModel?.length) {
                this.add(this.loadedModel[indexToLoad].scene);
                this.loadAnimation(this.loadedModel[indexToLoad]);
            }
            else {
                this.loadAllModels()
                .then(() => {
                    this.add(this.loadedModel[0].scene);
                    this.loadAnimation(this.loadedModel[0]);
                })
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
            const skeletonHelper = new THREE.SkeletonHelper(this.children[0]);
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

    update(delta) {
        if(this.animated) this.mixer.update(delta);
    }

    /**
     * @returns une copie de l'objey actuel
     */
    clone() {
        let copied = Object.assign(Object.getPrototypeOf(this), this);
        return copied;
    }
}