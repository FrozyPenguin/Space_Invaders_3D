import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { Projectile } from '../Mechanics/projectile.js';
import { scene } from '../scene.js';
import { GameObject } from '../StaticElements/gameObject.js';

class Defender extends GameObject {
    /**
     * Constructeur d'un defender
     * @param { String } color couleur du defender
     * @param { Number } speed vitesse de déplacement du defender
     */
    constructor(color, speed, projectileSpeed = 200) {
        // Create the defender object
        const defenderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        const defenderMaterial = new THREE.MeshBasicMaterial({ color });
        super(defenderGeometry, defenderMaterial);
        this.reset();

        this.xSpeed = speed;

        // this.keyboard = new THREEx.KeyboardState();
        // this.handleKeyboardUnique();

        this.name = 'Defender';

        scene.add(this);

        // let rightWall = scene.getObjectByName('rightWall');
        // const helper = new THREE.Box3Helper( new THREE.Box3().setFromObject(rightWall), 0xffff00 );
        // scene.add( helper );

        this.readyToShoot = true;

        this.projectileSpeed = projectileSpeed;
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

            let projectile = new Projectile(1, 3 , 1, 0xff00ff, this, this.collideGroup);
            projectile.setVelocity(this.projectileSpeed);

            setTimeout(() => this.readyToShoot = true, global.timeBetweenShoots);
            //global.updateList.push(projectile);
        }
    }

    setCollideGroup(group) {
        this.collideGroup = group;
    }

    /**
     * Réinitialise la position
     */
    reset() {
        this.position.x = 0;
        this.position.z = -(global.invadersSize + global.invadersPadding) * ((global.nbInvaders / global.invadersPerLine) + global.turnBeforeDeath);
        this.position.y = global.invadersSize / 2 + 0.001;
    }
}

export {
    Defender
}