import * as THREE from '../../lib/Three.js/build/three.module.js';
import { GameObject } from '../StaticElements/gameObject.js';
import { scene } from '../scene.js';
import { Projectile } from '../Mechanics/projectile.js';
import { takeDamage } from '../Mechanics/health.js';
import { gameEvent } from '../game.js';

// TODO: Faire l'intelligence artificielle progressive au fil des niveau avec en fonction de l'id du niveau courant on augmente la précision
class Invader extends GameObject {

    /**
     * Constructeur d'un Invaders
     * @param { String } color couleur de l'invader
     * @param { typeInvader } type type de l'invader
     * @param { Number } point point distribué lors de l'élimination de l'invader
     */
    constructor(size, shootProb, localConfig) {
        if(!localConfig.projectiles) throw "Config de l'invader invalide ! : Aucun projectile";

        if(localConfig.models?.length && localConfig.models instanceof Array) {
            super();

            this.models = localConfig.models;
        }
        else if(localConfig.colors && localConfig.colors != []) {
            const invaderGeometry = new THREE.BoxBufferGeometry(size, size, size);
            const invaderMaterial = new THREE.MeshBasicMaterial();
            super(invaderGeometry, invaderMaterial);

            this.position.y = size / 2 + 0.001;

            this.colors = localConfig.colors;
        }
        else {
            throw "Config des invaders invalide !";
        }

        this.health = this.maxModel = localConfig.health;

        this.loadNext();

        this.points = localConfig.points;

        this.name = 'Invader';

        this.probToShoot = shootProb;
        this.size = size;

        this.localConfig = localConfig;

        //this.isCollidingDefender()
    }

    /**
     * Détruit un invader
     */
    death() {
        this.health--;
        if(this.health <= 0) {
            this.visible = false;

            // TODO: Génération aléatoire de bonus
            // Plus on est au level, moins on a de proba
            let level = 1;
            const bonus = Math.random();
            if(bonus < 0.01 * level) gameEvent.emit('onBonus', { pos: this.position });
            return true;
        }
        else {
            this.loadNext();
            return false;
        }
    }

    /**
     * Ramene à la vie un invader
     */
    live(health) {
        this.visible = true;
        this.health = health;
        this.loadNext();
    }

    /**
     * Tire un projectile
     */
    shoot() {
        let projectile = new Projectile(this.localConfig.projectiles, this, this.collideGroup);
        console.log("shoot")
    }

    /**
     * Detecte si un invader rentre en collision avec le defender
     */
    isCollidingDefender() {
        let defender = scene.getObjectByName(`Defender`);
        if(defender) return this.getBoundingBox().intersectsBox(defender.getBoundingBox());
        return false;
    }

    /**
     * Detecte si un invader rentre en collision avec un shield
     */
     isCollidingShields() {
        let shields = scene.getObjectByName(`Shields`);
        shields?.children?.forEach(shield => {
            if(this.getBoundingBox().intersectsBox(shield.getBoundingBox())) {
                gameEvent.emit('onShieldDamage', shield)
            };
        })
    }

    update(delta) {
        //const haveToShoot = Math.random();
        if(Math.random() < this.probToShoot) this.shoot();

        // Si un invader rentre en collision avec le defender, alors il prend des dégats
        if(this.isCollidingDefender()) {
            if(takeDamage() == 0) {
                gameEvent.emit('onDefenderDamage');
            };
        }

        this.isCollidingShields();
    }

    clone() {
        return this;
    }
}

export {
    Invader
}
