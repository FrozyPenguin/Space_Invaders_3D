import * as THREE from '../../lib/Three.js/build/three.module.js';
import { Projectile } from '../Mechanics/projectile.js';
import { scene } from '../scene.js';
import { GameObject } from '../StaticElements/gameObject.js';

class Defender extends GameObject {
    /**
     * Constructeur d'un defender
     * @param { String } color couleur du defender
     * @param { Number } speed vitesse de déplacement du defender
     */
    constructor(localConfig) {
        if(!localConfig.projectiles) throw "Config du defender invalide ! : Aucun projectile";

        if(localConfig.model && localConfig.model != {} && localConfig.model instanceof Object) {
            super();

            this.loadModel(localConfig.model)
            .catch(err => {
                console.error(err);
            });
        }
        else if(localConfig.color) {
            // Create the defender object
            const defenderGeometry = new THREE.BoxBufferGeometry(localConfig.width, localConfig.height, localConfig.height);
            const defenderMaterial = new THREE.MeshBasicMaterial({ color: parseInt(localConfig.color) });
            super(defenderGeometry, defenderMaterial);

            this.position.y = localConfig.height / 2 + 0.001;
        }
        else {
            throw "Config du defender invalide !";
        }
        // // Create the defender object
        // const defenderGeometry = new THREE.BoxBufferGeometry(localConfig.width, localConfig.height, localConfig.height);
        // const defenderMaterial = new THREE.MeshBasicMaterial({ color });
        // super(defenderGeometry, defenderMaterial);
        // this.reset();

        //this.position.z = -210

        this.xSpeed = localConfig.speed;
        this.shootDelay = localConfig.shotDelay;

        // this.keyboard = new THREEx.KeyboardState();
        // this.handleKeyboardUnique();

        this.name = 'Defender';

        scene.add(this);

        // let rightWall = scene.getObjectByName('rightWall');
        // const helper = new THREE.Box3Helper( new THREE.Box3().setFromObject(rightWall), 0xffff00 );
        // scene.add( helper );

        this.readyToShoot = true;

        this.height = localConfig.height;
        this.width = localConfig.width;

        this.localConfig = localConfig;
    }

    /**
     * Boucle de controle au clavier du defender
     * @param { String } dir Direction du mouvement
     * @param { Number } delta temps écoulé depuis la derniere période d'horloge
     */
    move(dir, delta) {
        if(dir === 'right' && !this.isCollidingWall('right')) {
            this.position.x -= this.xSpeed * delta;
        }
        else if(dir === 'left' && !this.isCollidingWall('left')) {
            this.position.x += this.xSpeed * delta;
        }
    }

    /**
     * Tire un projectile
     */
    shoot() {
        if(this.readyToShoot) {
            this.readyToShoot = false;

            let projectile = new Projectile(this.localConfig.projectiles, this, this.collideGroup);

            setTimeout(() => this.readyToShoot = true, this.shootDelay);
        }
    }

    setShootDelay(delay) {
        this.shootDelay = delay;
    }

    /**
     * Réinitialise la position
     */
    reset() {
        this.position.x = 0;

        //this.position.z = -210
    }

    setZPosition(z) {
        this.position.z = z;
    }
}

export {
    Defender
}