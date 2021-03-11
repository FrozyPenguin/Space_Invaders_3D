import * as THREE from '../../lib/Three.js/build/three.module.js';
import { scene } from '../scene.js';
import { GameObject } from '../StaticElements/gameObject.js';
import { Defender } from '../Characters/defender.js';
import { Invader } from '../Characters/invaders.js';
import { gameEvent } from '../game.js';
import { Shield } from './shield.js';

class Projectile extends GameObject {
    /**
     * Constructeur du projectile
     * @param { Number } width largeur du projectile
     * @param { Number } depth profondeur du projectile
     * @param { Number } height hauteur du projectile
     * @param { String } color couleur du projectile
     * @param { THREE.Mesh } sender émetteur du projectile
     */
    constructor(localConfig, sender, collideGroup = []) {
        if(localConfig.model && localConfig.model != {} && localConfig.model instanceof Object) {
            super();

            this.loadModel(localConfig.model)
            .catch(err => {
                console.error(err);
            });
        }
        else if(localConfig.color) {
            // Create the defender object
            const projectileGeometry = new THREE.BoxBufferGeometry(localConfig.size, localConfig.size, localConfig.size);
            const projectileMaterial = new THREE.MeshBasicMaterial({ color: parseInt(localConfig.color) });
            super(projectileGeometry, projectileMaterial)
        }
        else {
            throw "Config du projectile invalide !";
        }

        this.vel;
        const center = new THREE.Vector3(0, 0, 0);
        this.position.set(sender.getWorldPosition(center).x, sender.getWorldPosition(center).y, sender.getWorldPosition(center).z);

        this.sender = sender;

        scene.getObjectByName('Projectiles').add(this);

        this.collideGroup = collideGroup;

        this.toRemove = false;

        this.name = 'Projectile';

        this.vel = localConfig.speed;

        if(!(sender instanceof Defender)) {
            this.vel *= -1;
        }
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
        this.collideGroup = this.collideGroup.filter(element => element.visible);
        for (let i = 0; i < this.collideGroup.length; i++) {
            const elementBox = this.collideGroup[i].getBoundingBox();
            const element = this.collideGroup[i];

            if(this.getBoundingBox().intersectsBox(elementBox)) {
                this.visible = false;

                if(this.sender instanceof Invader && element instanceof Defender) {
                    gameEvent.emit('onDefenderDamage');
                }

                if(element instanceof Invader && this.sender instanceof Defender) gameEvent.emit('onInvaderDeath', element);

                if(element instanceof Shield) gameEvent.emit('onShieldDamage', element);

                this.toRemove = true;
                // this.parent.remove(this);
            }
        }
        //invader.death();
    }

    /**
     * Ajoute un objet dans le groupe de collision du missile
     * @param { THREE.Box3 } box3
     */
    addToCollideGroup(box3) {
        this.collideGroup.push(box3);
    }

    /**
     * Fonction de mise a jour de l'élément
     * @param { Number } delta temps écoulé depuis la dérniere période d'horloge
     */
    update(delta) {
        this.collide();
        this.position.z += this.vel * delta;
    }
}

export {
    Projectile
}