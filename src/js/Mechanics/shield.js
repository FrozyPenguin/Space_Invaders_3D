import * as THREE from '../../lib/Three.js/build/three.module.js';
import { GameObject } from '../StaticElements/gameObject.js';

// Un shield prendra en parametre un position en Z, un espacement entre les murs et un nombre de mur à placer
// La position en Z ca sera defender.position.z - (taille du defender*2)
export class Shield extends GameObject {
    constructor(localConfig) {
        if(localConfig.models?.length && localConfig.models instanceof Array) {
            super();

            this.models = localConfig.models;
        }
        else if(localConfig.colors && localConfig.colors != []) {
            const shieldGeometry = new THREE.BoxBufferGeometry(localConfig.width, localConfig.height, localConfig.height);
            const shieldMaterial = new THREE.MeshBasicMaterial();
            super(shieldGeometry, shieldMaterial);

            this.position.y = localConfig.height / 2 + 0.001;

            this.colors = localConfig.colors;
        }
        else {
            throw "Config des Shields invalide !";
        }

        this.health = this.maxModel = localConfig.health;

        this.loadNextModel();

        this.name = 'Shield';

        this.localConfig = localConfig;
    }

    takeDamage() {
        this.health--;

        if(this.health <= 0) {
            this.visible = false;
        }
        else {
            this.loadNextModel();
        }
    }

    regen() {
        this.health = this.maxModel;
        this.visible = true;
        this.loadNextModel();
    }
}