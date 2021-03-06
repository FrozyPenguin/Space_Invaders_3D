import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { GameObject } from '../StaticElements/gameObject.js';
import { scene } from '../scene.js';
import { Projectile } from '../Mechanics/projectile.js';
import { takeDamage } from '../Mechanics/health.js';
import { gameEvent } from '../game.js';

class Invader extends GameObject {

    /**
     * Constructeur d'un Invaders
     * @param { String } color couleur de l'invader
     * @param { typeInvader } type type de l'invader
     * @param { Number } point point distribué lors de l'élimination de l'invader
     */
    constructor(color, type, points, projectileSpeed = 200, model) {
        if(!model) {
            const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
            const invaderMaterial = new THREE.MeshBasicMaterial({ color });
            super(invaderGeometry, invaderMaterial);

            this.position.y = global.invadersSize / 2 + 0.001;
        }
        else {
            super();
            this.load(model)
            .then(() => {
                this.children.forEach(child => {
                    child.scale.x *= global.invadersSize;
                    child.scale.y *= global.invadersSize;
                    child.scale.z *= global.invadersSize;
                })
            })
            .catch(err => {
                console.error(err);
            });
        }

        this.name = type;
        this.points = points;

        this.name = 'Invader';

        this.projectileSpeed = projectileSpeed;
    }

    /**
     * Détruit un invader
     */
    death() {
        this.visible = false;

        // TODO: Génération aléatoire de bonus
        // Plus on est au level, moins on a de proba
        let level = 1;
        const bonus = Math.random();
        if(bonus < 0.01 * level) gameEvent.emit('onBonus', { pos: this.position });
    }

    /**
     * Ramene à la vie un invader
     */
    live() {
        this.visible = true;
    }

    /**
     * Tire un projectile
     */
    shoot() {
        let projectile = new Projectile(1, 3 , 1, 0xffff00, this, this.collideGroup);
        projectile.setVelocity(-this.projectileSpeed);
        console.log("shoot")
        //global.updateList.push(projectile);
    }

    setCollideGroup(group) {
        this.collideGroup = group;
    }

    /**
     * Detecte si un invader rentre en collision avec le defender
     */
    isCollidingDefender() {
        let defender = scene.getObjectByName(`Defender`);
        if(defender) {
            let defenderBB = new THREE.Box3().setFromObject(defender);

            return this.getBoundingBox().intersectsBox(defenderBB);
        }
        return false;
    }

    update(delta) {
        //const haveToShoot = Math.random();
        if(Math.random() < global.probToShoot) this.shoot();

        // Si un invader rentre en collision avec le defender, alors il prend des dégats
        if(this.isCollidingDefender()) {
            if(takeDamage() == 0) {
                gameEvent.emit('onDefenderDamage');
            };
        }
    }

    clone() {
        return this;
    }
}

export {
    Invader
}
