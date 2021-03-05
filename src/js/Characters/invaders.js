import * as THREE from '../../lib/Three.js/build/three.module.js';
import global from '../global.js';
import { GameObject } from '../StaticElements/gameObject.js';
import { scene } from '../scene.js';
import { Projectile } from '../Mechanics/projectile.js';
import { takeDamage } from '../Mechanics/health.js';
import { gameEvent } from '../game.js';

const typeInvader = [
    {
        type: 'novice',
        color: new THREE.Color(0xffffff),
        point: 10
    },
    {
        type: 'venere',
        color: new THREE.Color(0xff0000),
        point: 20
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    },
    {
        type: 'ultraVenere',
        color: new THREE.Color(0x00ffff),
        point: 50
    }
].reverse();



let directionSpeed = {
    x: 50,
    y: 0,
    z: 0
}

class Invader extends GameObject {

    /**
     * Constructeur d'un Invaders
     * @param { String } color couleur de l'invader
     * @param { typeInvader } type type de l'invader
     * @param { Number } point point distribué lors de l'élimination de l'invader
     */
    constructor(color, type, points, projectileSpeed = 200) {
        const invaderGeometry = new THREE.BoxBufferGeometry(global.invadersSize, global.invadersSize, global.invadersSize);
        const invaderMaterial = new THREE.MeshBasicMaterial({ color });
        super(invaderGeometry, invaderMaterial);
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
        if(this.isCollidingWall('left')) {
            directionSpeed.x = directionSpeed.x > 0 ? directionSpeed.x * -1 : directionSpeed.x;
            directionSpeed.z = -200;
        }
        else if(this.isCollidingWall('right')) {
            directionSpeed.x = directionSpeed.x < 0 ? directionSpeed.x * -1 : directionSpeed.x;
            directionSpeed.z = -200;
        }

        //const haveToShoot = Math.random();
        if(Math.random() < global.probToShoot) this.shoot();

        // Si un invader rentre en collision avec le defender, alors il prend des dégats
        if(this.isCollidingDefender()) {
            if(takeDamage() == 0) {
                gameEvent.emit('onDefenderDamage');
            };
        }
    }
}

const invaderGroup = new THREE.Group();

/**
 * Réinitialise la position du groupe d'invaders
 */
invaderGroup.reset = () => {
    invaderGroup.position.x = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);
    invaderGroup.position.y = global.invadersSize / 2 + 0.001;
    invaderGroup.position.z = (global.invadersSize + global.invadersPadding) * Math.floor(global.invadersPerLine / 2);

    directionSpeed.x = Math.abs(directionSpeed.x);
}

/**
 * Créer l'ensemble des invaders
 */
function initInvaders() {
    invaderGroup.remove(...invaderGroup.children);

    // Create invaders objects
    invaderGroup.name = 'Les envahisseurs 2.0';

    for (let i = 0; i < global.nbInvaders; i++) {
        let type = typeInvader[Math.floor(i/global.invadersPerLine)];
        let invader = new Invader(type.color, type.type, type.point);

        if (i != 0) {
            invader.position.set( invaderGroup.children[i - 1].position.x - (global.invadersSize + global.invadersPadding), 0, invaderGroup.children[i - 1].position.z )

            if (i % global.invadersPerLine == 0) {
                invader.position.set( invaderGroup.children[0].position.x , 0, invaderGroup.children[i - 1].position.z - (global.invadersSize + global.invadersPadding) )
            }
        }

        // invader.on('kill') => Parcourir invaderGroup -> Si tout active = false alors fin de game niveau suivant

        invaderGroup.add(invader);
    }

    return invaderGroup;
}


/**
 * Créer le mouvement des invaders
 */
invaderGroup.update = (delta) => {
    invaderGroup.position.x += delta * directionSpeed.x;
    invaderGroup.position.y += delta * directionSpeed.y;
    invaderGroup.position.z += delta * directionSpeed.z;

    directionSpeed.z = 0;
}

export {
    initInvaders,
    Invader,
}
