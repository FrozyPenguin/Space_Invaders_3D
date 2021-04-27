import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/build/three.module.js';
import { GameObject } from '../StaticElements/gameObject.js';
import { scene } from '../scene.js';
import { Projectile } from '../Mechanics/projectile.js';
import { gameEvent } from '../game.js';
import { distanceX } from '../Utils/distance.js';

class Invader extends GameObject {

    /**
     * Constructeur d'un Invaders
     * @param { String } color couleur de l'invader
     * @param { typeInvader } type type de l'invader
     * @param { Number } point point distribué lors de l'élimination de l'invader
     */
    constructor(size, shootProb, localConfig, target) {
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

        this.loadNextModel();

        this.points = localConfig.points;

        this.name = 'Invader';

        this.probToShoot = shootProb;
        this.size = size;

        this.localConfig = JSON.parse(JSON.stringify(localConfig));

        this.accuracy = this.localConfig.accuracy ? this.localConfig.accuracy : 0;

        this.target = target;

        this.boardSize = 0;

        this.shootDelayEnded = true;

        this.projectile = new Projectile(this.localConfig.projectiles, this.collideGroup, false, this);
    }

    /**
     * Définie la taille du plateau de jeu pour les besoins de la pseudo IA
     * @param { Number } size Taille du plateau de jeu
     */
    setBoardSize(size) {
        this.boardSize = size;
    }

    /**
     * Détruit un invader
     */
    death() {
        this.health--;
        if(this.health <= 0) {
            this.visible = false;

            const bonus = Math.random();
            const pos = new THREE.Vector3();
            this.getWorldPosition(pos);
            if(bonus < 0.01) gameEvent.emit('onBonus', { pos });
            return true;
        }
        else {
            this.loadNextModel();
            return false;
        }
    }

    /**
     * Ramene à la vie un invader
     */
    live(health) {
        this.visible = true;
        this.health = health;
        this.loadNextModel();
    }

    /**
     * Tire un projectile
     */
    shoot() {
        if(this.shootDelayEnded) {
            const center = new THREE.Vector3(0, 0, 0);
            //let projectile = new Projectile(this.localConfig.projectiles, this, this.collideGroup);
            let projectile = new Projectile(this.localConfig.projectiles, this.collideGroup, true, this).copy(this.projectile, true);
            projectile.position.x = this.getWorldPosition(center).x;
            projectile.position.z = this.getWorldPosition(center).z;
            scene.getObjectByName('Projectiles').add(projectile);

            this.shootDelayEnded = false;
            setTimeout(() => {
                this.shootDelayEnded = true;
            }, 100)
        }
    }

    /**
     * Augmente la vitesse des projectiles tiré
     * @param { Number } speed Valeur d'augmentation
     */
    increaseProjectilesSpeed(speed) {
        this.localConfig.projectiles.speed += speed;
        this.projectile.setVelocity(this.localConfig.projectiles.speed);
    }

    /**
     * Augmente la précision des invaders
     * @param { Number } value Valeur d'augmentation
     */
    increaseAccuracy(value) {
        this.accuracy += value;
        if(this.accuracy > 100) this.accuracy = 100;
    }

    /**
     * Augmente la probabilité de tire
     * @param { Number } value Valeur d'augmentation
     */
    increaseShootProb(value) {
        this.probToShoot += value;
    }

    /**
     * Detecte si un invader rentre en collision avec le defender
     */
    isCollidingDefender() {
        let defender = this.target;
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
                gameEvent.emit('onShieldDamage', shield);
            };
        })
    }

    /**
     * Définie si un invader peut tirer ou non
     * @returns { Boolean }
     */
    canShoot() {
        let currentObjectPosition = new THREE.Vector3();
        this.getWorldPosition(currentObjectPosition);
        return distanceX(currentObjectPosition, this.target.position) <= (100 - this.accuracy) / 100 * (this.boardSize / 2) + 1 && this.shootDelayEnded && this.visible;
    }

    /**
     * Boucle d'animation des invaders
     * @param {*} delta
     */
    update(delta) {
        super.update(delta);
        if(this.canShoot()) {
            if(Math.random() < this.probToShoot) {
                this.shoot();
            }
        }

        // Si un invader rentre en collision avec le defender, alors la partie est terminé même si on est invincible
        if(this.isCollidingDefender()) {
            gameEvent.emit('onEndGame');
        }

        this.isCollidingShields();
    }
}

export {
    Invader
}
